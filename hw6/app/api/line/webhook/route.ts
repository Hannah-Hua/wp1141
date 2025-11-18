import { NextRequest, NextResponse } from 'next/server';
import { validateSignature, replyTextMessage, replyGameStartMessage, replyClassSelectionMessage, replyClassConfirmationMessage, replyGameOptionsMessage, replyGameOverMessage } from '@/lib/lineService';
import { getOrCreateConversation, createNewConversation, updateGameState, addMessage, getRecentMessages, applyGameEffects } from '@/lib/gameService';
import { generateGameTurn, getFallbackResponse } from '@/lib/llmService';
import connectDB from '@/lib/mongodb';
import { GamePhase, CharacterClass } from '@/types/game';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    // 連線資料庫
    await connectDB();

    // 取得請求內容
    const body = await request.text();
    const signature = request.headers.get('x-line-signature') || '';

    // 驗證簽名
    if (!validateSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const events = JSON.parse(body).events || [];

    // 處理每個事件
    for (const event of events) {
      // 只處理訊息事件
      if (event.type !== 'message' || event.message.type !== 'text') {
        continue;
      }

      const lineUserId = event.source.userId;
      const userMessage = event.message.text.trim();
      const replyToken = event.replyToken;

      if (!lineUserId) {
        continue;
      }

      // 取得或建立使用者
      let user = await User.findOne({ lineUserId });
      if (!user) {
        user = new User({
          lineUserId,
          displayName: event.source.type === 'user' ? undefined : 'Unknown',
        });
        await user.save();
      }

      // 取得或建立會話
      const conversation = await getOrCreateConversation(lineUserId);
      const gameState = conversation.gameState;

      // 處理「重新開始」指令
      if (userMessage === '重新開始' || userMessage === '開始冒險') {
        // 建立新會話
        const newConversation = await createNewConversation(lineUserId);
        newConversation.messages.push({
          role: 'system',
          content: '遊戲重新開始',
          timestamp: new Date(),
          metadata: { gamePhase: 'idle' },
        });
        newConversation.messages.push({
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
        });
        await newConversation.save();
        
        await updateGameState(lineUserId, { phase: 'creating_name' });
        await replyGameStartMessage(replyToken);
        
        const updatedConv = await getOrCreateConversation(lineUserId);
        updatedConv.messages.push({
          role: 'assistant',
          content: '遊戲開始提示',
          timestamp: new Date(),
          metadata: { gamePhase: 'creating_name' },
        });
        await updatedConv.save();
        continue;
      }

      // 處理固定起始流程
      if (gameState.phase === 'idle') {
        await replyTextMessage(replyToken, '歡迎來到「遺失在台大地下室的秘寶」！\n\n請輸入「開始冒險」來開始遊戲。');
        continue;
      }

      // Step 1: 輸入名稱
      if (gameState.phase === 'creating_name') {
        const name = userMessage;
        await updateGameState(lineUserId, {
          phase: 'choosing_class',
          character: {
            ...gameState.character,
            name,
            hp: 100,
            maxHp: 100,
          },
        });
        await addMessage(lineUserId, 'user', userMessage);
        await replyClassSelectionMessage(replyToken, name);
        await addMessage(lineUserId, 'assistant', '職業選擇提示', { gamePhase: 'choosing_class' });
        continue;
      }

      // Step 2: 選擇職業
      if (gameState.phase === 'choosing_class') {
        const classMap: Record<string, CharacterClass> = {
          '1': 'coder_mage',
          '2': 'data_knight',
          '3': 'slide_ranger',
        };

        const selectedClass = classMap[userMessage];
        if (!selectedClass) {
          await replyTextMessage(replyToken, '請輸入 1、2 或 3 來選擇職業。');
          continue;
        }

        await updateGameState(lineUserId, {
          phase: 'playing',
          character: {
            ...gameState.character,
            class: selectedClass,
          },
        });
        await addMessage(lineUserId, 'user', userMessage);
        await replyClassConfirmationMessage(replyToken, selectedClass);
        await addMessage(lineUserId, 'assistant', '職業確認', { gamePhase: 'playing' });
        continue;
      }

      // Step 3: 遊戲進行中（交給 LLM）
      if (gameState.phase === 'playing') {
        // 優化：先取得會話，減少重複查詢
        const currentConversation = await getOrCreateConversation(lineUserId);
        const currentGameState: GamePhase = currentConversation.gameState.phase as GamePhase;

        if (currentGameState !== 'playing') {
          continue;
        }

        // 並行執行：同時儲存使用者訊息和取得對話歷史
        const [_, recentMessages] = await Promise.all([
          addMessage(lineUserId, 'user', userMessage),
          getRecentMessages(lineUserId, 5),
        ]);

        try {
          // 呼叫 LLM 生成遊戲回合（設定 5 秒 timeout）
          const turnResult = await generateGameTurn(
            userMessage,
            {
              phase: currentGameState,
              character: currentConversation.gameState.character as any,
              progress: currentConversation.gameState.progress,
              currentLocation: currentConversation.gameState.currentLocation,
            },
            recentMessages
          );

          // 應用遊戲效果（會更新 conversation）
          const updatedConversation = await applyGameEffects(lineUserId, turnResult.effects);

          // 檢查遊戲是否結束
          if (updatedConversation.gameState.phase === 'game_over') {
            // 判斷是勝利還是失敗
            const isVictory = updatedConversation.gameState.progress >= 100 || 
                              (turnResult.effects.game_over !== false && 
                               updatedConversation.gameState.character.hp > 0);
            
            // 並行執行：回覆訊息和儲存對話（不等待儲存完成）
            await replyGameOverMessage(replyToken, isVictory);
            addMessage(lineUserId, 'assistant', turnResult.narration, {
              gamePhase: 'game_over',
              gameState: updatedConversation.gameState,
            }).catch(err => console.error('Failed to save message:', err));
          } else {
            // 回覆遊戲選項（傳遞進度資訊）
            await replyGameOptionsMessage(
              replyToken, 
              turnResult.narration, 
              turnResult.options,
              { progress: updatedConversation.gameState.progress }
            );
            // 背景儲存訊息（不阻塞回應）
            addMessage(lineUserId, 'assistant', turnResult.narration, {
              gamePhase: 'playing',
              gameState: updatedConversation.gameState,
            }).catch(err => console.error('Failed to save message:', err));
          }
        } catch (error: any) {
          console.error('Game turn error:', error);
          console.error('Error type:', error.constructor.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          
          // 降級處理（使用當前會話狀態）
          const fallbackResult = getFallbackResponse({
            phase: currentGameState,
            character: currentConversation.gameState.character as any,
            progress: currentConversation.gameState.progress,
          });

          // 根據錯誤類型提供更詳細的錯誤訊息（使用 replyGameOptionsMessage 確保有選項）
          if (error.message === 'LLM_QUOTA_EXCEEDED') {
            await replyGameOptionsMessage(
              replyToken, 
              '⚠️ 劇情之神暫時無法回應（API 配額已用完），請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態']
            );
          } else if (error.message === 'LLM_TIMEOUT') {
            await replyGameOptionsMessage(
              replyToken,
              '⏱️ 劇情之神回應超時，請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態']
            );
          } else if (error.message === 'OPENAI_JSON_PARSE_ERROR') {
            console.error('OpenAI 回應格式錯誤，無法解析 JSON');
            await replyGameOptionsMessage(
              replyToken,
              '⚠️ 劇情之神的回應格式有誤，請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態', '繼續探索']
            );
          } else if (error.message === 'OPENAI_INVALID_FORMAT') {
            console.error('OpenAI 回應格式不符合預期');
            await replyGameOptionsMessage(
              replyToken,
              '⚠️ 劇情之神的回應格式不符合預期，請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態', '繼續探索']
            );
          } else {
            // 其他錯誤，使用降級回應（有選項）
            console.error('Unknown error, using fallback response');
            await replyGameOptionsMessage(
              replyToken,
              fallbackResult.narration,
              fallbackResult.options
            );
          }
          
          // 背景儲存錯誤訊息（不阻塞回應）
          addMessage(lineUserId, 'assistant', fallbackResult.narration, {
            gamePhase: currentGameState,
            error: error.message,
            errorType: error.constructor.name,
          }).catch(err => console.error('Failed to save error message:', err));
        }
        continue;
      }

      // 遊戲結束狀態
      if (gameState.phase === 'game_over') {
        await replyTextMessage(replyToken, '遊戲已結束。請輸入「開始冒險」來開始新的冒險。');
        continue;
      }

      // 預設回應
      await replyTextMessage(replyToken, '我不太理解你的意思，請輸入「開始冒險」來開始遊戲。');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// LINE Webhook 需要支援 GET 請求（用於驗證）
export async function GET() {
  return NextResponse.json({ message: 'LINE Webhook endpoint is active' });
}

