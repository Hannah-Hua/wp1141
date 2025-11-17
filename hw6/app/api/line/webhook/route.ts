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
        await addMessage(lineUserId, 'user', userMessage);

        // 取得最近的對話歷史
        const recentMessages = await getRecentMessages(lineUserId, 5);
        
        // 更新會話以取得最新狀態
        const updatedConversation = await getOrCreateConversation(lineUserId);
        const currentGameState: GamePhase = updatedConversation.gameState.phase as GamePhase;

        if (currentGameState !== 'playing') {
          continue;
        }

        try {
          // 呼叫 LLM 生成遊戲回合
          const turnResult = await generateGameTurn(
            userMessage,
            {
              phase: currentGameState,
              character: updatedConversation.gameState.character as any,
              progress: updatedConversation.gameState.progress,
              currentLocation: updatedConversation.gameState.currentLocation,
            },
            recentMessages
          );

          // 應用遊戲效果
          await applyGameEffects(lineUserId, turnResult.effects);

          // 檢查遊戲是否結束
          const finalConversation = await getOrCreateConversation(lineUserId);
          if (finalConversation.gameState.phase === 'game_over') {
            // 判斷是勝利還是失敗
            const isVictory = finalConversation.gameState.progress >= 100 || 
                              (turnResult.effects.game_over !== false && 
                               finalConversation.gameState.character.hp > 0);
            
            await replyGameOverMessage(replyToken, isVictory);
            await addMessage(lineUserId, 'assistant', turnResult.narration, {
              gamePhase: 'game_over',
              gameState: finalConversation.gameState,
            });
          } else {
            // 回覆遊戲選項（傳遞進度資訊）
            console.log('Replying with options:', {
              narrationLength: turnResult.narration.length,
              optionsCount: turnResult.options.length,
              options: turnResult.options,
              progress: finalConversation.gameState.progress,
            });
            await replyGameOptionsMessage(
              replyToken, 
              turnResult.narration, 
              turnResult.options,
              { progress: finalConversation.gameState.progress }
            );
            await addMessage(lineUserId, 'assistant', turnResult.narration, {
              gamePhase: 'playing',
              gameState: finalConversation.gameState,
            });
          }
        } catch (error: any) {
          console.error('Game turn error:', error);
          console.error('Error type:', error.constructor.name);
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
          
          // 降級處理
          const fallbackResult = getFallbackResponse({
            phase: currentGameState,
            character: updatedConversation.gameState.character as any,
            progress: updatedConversation.gameState.progress,
          });

          // 根據錯誤類型提供更詳細的錯誤訊息（使用 replyGameOptionsMessage 確保有選項）
          if (error.message === 'LLM_QUOTA_EXCEEDED' || error.message === 'GEMINI_QUOTA_EXCEEDED') {
            await replyGameOptionsMessage(
              replyToken, 
              '⚠️ 劇情之神暫時無法回應（API 配額已用完），請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態']
            );
          } else if (error.message === 'LLM_TIMEOUT' || error.message === 'GEMINI_TIMEOUT') {
            await replyGameOptionsMessage(
              replyToken,
              '⏱️ 劇情之神回應超時，請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態']
            );
          } else if (error.message === 'GEMINI_SERVICE_UNAVAILABLE') {
            console.error('Gemini service unavailable (503)');
            await replyGameOptionsMessage(
              replyToken,
              '🚧 劇情之神的伺服器太忙，暫時無法回應。請稍後再試，冒險會在這裡等你！',
              ['稍後再試', '查看當前狀態']
            );
          } else if (error.message === 'GEMINI_JSON_PARSE_ERROR' || error.message === 'OPENAI_JSON_PARSE_ERROR') {
            console.error('LLM 回應格式錯誤，無法解析 JSON');
            await replyGameOptionsMessage(
              replyToken,
              '⚠️ 劇情之神的回應格式有誤，請稍後再試。\n\n你的冒險仍在繼續。',
              ['稍後再試', '查看當前狀態', '繼續探索']
            );
          } else if (error.message === 'GEMINI_INVALID_FORMAT' || error.message === 'OPENAI_INVALID_FORMAT') {
            console.error('LLM 回應格式不符合預期');
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
          
          await addMessage(lineUserId, 'assistant', fallbackResult.narration, {
            gamePhase: currentGameState,
            error: error.message,
            errorType: error.constructor.name,
          });
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

