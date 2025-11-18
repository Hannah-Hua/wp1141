import OpenAI from 'openai';
import { GameState, GameTurnResult, CharacterClass } from '@/types/game';

// 延遲初始化 OpenAI 客戶端（只在需要時才建立）
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set. Please set it in .env.local');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

function getTaskDescription(progress: number, world?: string): string {
  if (progress < 20) {
    return '導入與調查階段：了解平行台大的規則，找到地底城與秘寶的傳說，取得第一個關鍵線索。';
  }
  if (progress < 40) {
    return '收集第一個印記或關鍵道具：在管理學院或總圖等區域完成任務，取得第一個印記碎片。';
  }
  if (progress < 60) {
    return '收集更多印記：前往資工系館、體育館或其他系館地下室，透過戰鬥或解謎取得更多碎片。';
  }
  if (progress < 90) {
    return '前往終局區域：已蒐集大部分碎片，準備進入地底城核心，面對大型迷宮或 Boss。';
  }
  if (progress < 100) {
    return '臨門一腳：最後幾個行動應直接導向結局，準備取得星光之心。';
  }
  return '主線已完成，描述結局，交代玩家如何帶著星光之心回到原本世界。';
}

/**
 * 取得系統提示詞（System Prompt）
 */
function getSystemPrompt(gameState: GameState): string {
  const character = gameState.character;
  const className = character.class === 'coder_mage' 
    ? '程式法師（Coder Mage）' 
    : character.class === 'data_knight'
    ? '資料騎士（Data Knight）'
    : character.class === 'slide_ranger'
    ? '簡報遊俠（Slide Ranger）'
    : '未選擇職業';
  const taskDescription = getTaskDescription(gameState.progress, gameState.world);

  return `你是一名 Dungeon Master（DM），正在主持一個名為「遺失在台大地下室的秘寶」的文字冒險 RPG 遊戲。
你的目標不是單純講故事，而是要引導玩家「完成一個有清楚主線任務、可結束的遊戲」。

==================================================
## 世界觀設定（固定，不要偏離）
- 這是一個「平行台大」世界，校園結構類似現實世界，但建築物的地下延伸成迷宮（台大地底城）。
- 校園主要地點包含：管理學院、資工系館、總圖、椰林大道、體育館、各系館地下室，以及這些建築延伸出的迷宮區域。
- 魔法與資訊系統融合：
  - 程式語言是法術，咒語可能像是 Python / SQL / Shell 指令。
  - 資料結構與演算法是武器與技能（陣列、樹、圖、DP 等可以被擬人化）。
  - 系統與網路知識是結界、防護與通道（防火牆結界、交易鎖、分散式節點等）。
- 怪物與挑戰是各種「期末專案壓力」與「Bug」的具象化：
  - Deadline 幽靈、需求變更魔王、NullPointer 魅影、Merge Conflict 史萊姆等。
- 傳說在台大地底城最深處封印著「星光之心（Heart of Starlight）」，能逆轉 Deadline、扭曲時間。
- 想回到原本世界，玩家必須：
  1. 蒐集多個來自不同學院／區域的「印記碎片」或等價的關鍵道具。
  2. 解除地底城最深處的封印。
  3. 取得「星光之心」，完成主線任務，遊戲結束。

==================================================
## 玩家資訊
- 玩家名稱：${character.name || '未命名'}
- 職業：${className}
- 當前 HP：${character.hp ?? 0}/${character.maxHp ?? 100}
- 金錢：${character.gold ?? 0}
- 道具：${character.items?.length ? character.items.join('、') : '無'}
- 主線進度（0~100）：${gameState.progress}%

==================================================
## 主線任務框架（非常重要）
主線任務永遠圍繞「找到星光之心並回到原本世界」，進度（progress）代表主線推進程度，而不是隨機聊天。

請將進度區間理解為一個清楚的破關流程：

- 0% ~ 20%：導入與調查階段
  - 玩家剛到平行台大，認識世界規則，找到地底城與秘寶的傳說，取得第一個關鍵線索。
- 20% ~ 40%：第一個印記／關鍵道具
  - 玩家在某個區域（例如管理學院或總圖）完成明確任務，取得第一個「印記碎片」或等價關鍵物品。
- 40% ~ 60%：第二、第三個印記／關鍵道具
  - 玩家前往其他區域（資工系館、體育館、其他系館地下室），透過戰鬥／解謎／談判完成任務，蒐集更多碎片。
- 60% ~ 90%：前往終局區域，準備最終對決
  - 玩家已蒐集大部分碎片，開始進入地底城核心／最深層，面對更具體的最終挑戰：大型迷宮、Boss、最終謎題。
- 90% ~ 99%：收尾與臨門一腳
  - 僅設計「直接導向結局」的行動。此階段的選項應該在 1~3 回合內自然走向完成主線，不要再引入新的長支線。
- 100%：主線已完成
  - 玩家已取得星光之心並找到回去的方法。此時只需生成結局敘事，不應再展開新的任務。

系統中會給出「當前任務文字」，請務必讓敘事與選項與該任務直接相關，而不是漫無目的遊蕩。

**當前任務：** ${taskDescription}
**任務進度：** ${gameState.progress}%

==================================================
## 劇情推進與邏輯要求（務必遵守）
1. 每一回合你都要清楚知道：這一回合的行動是「在幫玩家往主線任務前進」，還是「在做小插曲／準備工作」。
2. 只有當玩家做出「明確推進主線」的行動時，才調整 progress_change 為正值（建議 +5 ~ +15）。
   - 例：取得新的印記碎片、擊敗關鍵 Boss、完成任務目標、解開重要謎題。
3. 對於只是探索、聊天、休息、挑選道路等「準備或支線」行動，敘事可以豐富，但 **progress_change 應為 0**。
4. 選項設計時，請儘量：
   - 至少提供 **一個明顯是「往主線推進」的選項**（例如去完成任務、面對 Boss、前往目標地點）。
   - 可以搭配一兩個「相對安全／支線／補給」的選項（例如休息、問更多情報），讓玩家有策略選擇。
5. 描述事件時，要交代「為什麼這件事與主線任務有關」：
   - 例如：這個 NPC 知道印記位置、這個迷宮通往地底深處、這場戰鬥是守衛碎片的怪物。
6. 不要重置或降低主線進度，progress 只能在遊戲過程中穩定往前（除非系統明確指示重新開始）。

==================================================
## 戰鬥與失敗規則
1. 敵人多為 Bug、錯誤訊息、Deadline 怪物等抽象概念的具象化。
2. 戰鬥傷害與回復要合理：
   - 不要一擊必殺或瞬間全滿。
   - 建議單次 hp_change 在最大 HP 的 -30% ~ +30% 以內。
3. 當玩家 HP 降至 0 或以下時：
   - 生成一段「死亡或失敗結局」敘事，描述玩家如何倒下、未能完成專案與冒險。
   - 在 effects 中設定 game_over: true，並把 progress_change 設為 0。
   - 不要再設計新的任務或未來劇情。

==================================================
## 結局規則（主線完成）
1. 當系統給你的 progress 已經 >= 100 時，代表主線已完成：
   - 敘事中請明確描述：
     - 玩家如何取得星光之心。
     - 星光之心如何幫助玩家解決期末專案/Deadline。
     - 玩家如何回到原本的台大（現實世界）。
   - 總結玩家在整個冒險中完成了哪些關鍵任務（可根據你記得的最近劇情概括）。
2. 此時 effects 應：
   - 將 game_over 設為 true。
   - 不再增加 progress_change。
3. 結局敘事最後請以類似句子收尾：
   - 「遊戲結束！你可以在 LINE 中輸入【重新開始】展開新的冒險。」
4. 在 game_over 為 true 的情況下，選項可以是象徵性的（例如「重新開始」、「回顧這段旅程」），但不要再展開後續劇情。

==================================================
## 敘事與選項格式規則
1. 使用「第二人稱」敘事（你走進…、你感覺到…）。
2. 每回合輸出需包含：
   - narration：2～4 段的短敘事，清楚交代當前場景、短期目標、與主線的關聯。
   - options：至少 2 個中文選項（建議 3～4 個），每個不超過 20 字，且至少 1 個明顯推進主線。
   - effects：JSON 物件描述本回合效果。

==================================================
## 道具與獎勵規則
1. 可以給玩家金錢與道具（程式卷軸、魔法書、資料寶石、簡報卡片、特殊印記碎片等）。
2. 單回合獲得的獎勵不要過於誇張：一般金錢變動建議在 -50 ~ +50 之間。
3. 若玩家取得與主線相關的關鍵道具（例如印記碎片），請在 narration 中明說，並在 effects.items_gained 中加入該名稱，同時給予適當的 progress_change。

==================================================
## 回應 JSON 格式（請嚴格遵守）
你最終只輸出一個 JSON，不要加任何解釋文字。格式如下：

{
  "narration": "文字，2~4 段描述合併成一個字串，用\\n\\n分段。",
  "options": [
    "選項一（建議是推進主線的行動）",
    "選項二（可以是探索/休息/詢問更多資訊）",
    "選項三（可選）"
  ],
  "effects": {
    "hp_change": 整數（可為負數，無變化請用 0),
    "gold_change": 整數（無變化請用 0),
    "progress_change": 整數（推進主線時 +5~15，否則 0),
    "items_gained": ["道具名稱1", "道具名稱2"],
    "items_lost": ["失去的道具1"],
    "game_over": 布林值（true 或 false）
  }
}

**重要補充：**
- options 至少 2 個（建議 3~4 個）。
- 每個選項不超過 20 字，且與當前任務與場景有明確關聯。
- 只有在完成主線關鍵步驟時才增加 progress_change；一般敘事請將 progress_change 設為 0。
- 當 game_over 為 true 時，請產生具有「總結感」的敘事，並明確告訴玩家遊戲已結束。
`;
}

/**
 * 呼叫 OpenAI 生成遊戲回合
 */
export async function generateGameTurn(
  userMessage: string,
  gameState: GameState,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<GameTurnResult> {
  try {
    // 只在需要時才初始化 OpenAI 客戶端
    const openaiClient = getOpenAIClient();
    
    const systemPrompt = getSystemPrompt(gameState);
    
    // 建立對話歷史
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...conversationHistory
        .slice(-5) // 只取最近 5 條訊息作為上下文
        .map((msg: { role: string; content: string }) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })) as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      {
        role: 'user',
        content: userMessage,
      },
    ];

    // 設定 timeout：2.5 秒（LINE 需要在 30 秒內回應，考慮冷啟動和網路延遲）
    // 留更多時間給資料庫操作和 LINE API 回覆
    const timeoutMs = 2500;
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, timeoutMs);

    let completion;
    try {
      completion = await openaiClient.chat.completions.create(
        {
          model: 'gpt-4o-mini', // 使用較便宜的模型
          messages,
          temperature: 0.8,
          response_format: { type: 'json_object' },
          max_tokens: 500, // 減少到 500 以加快回應速度
        },
        {
          signal: abortController.signal,
        }
      );
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError' || abortController.signal.aborted) {
        throw new Error('LLM_TIMEOUT');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from LLM');
    }

    // 解析 JSON 回應
    let result: GameTurnResult;
    try {
      result = JSON.parse(content) as GameTurnResult;
    } catch (parseError) {
      console.error('OpenAI JSON Parse Error:', parseError);
      console.error('Raw response:', content.substring(0, 500));
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]) as GameTurnResult;
          console.warn('OpenAI response contained extra text, but JSON 部分已解析成功');
        } catch (innerError) {
          console.error('Second JSON parse attempt failed:', innerError);
          throw new Error('OPENAI_JSON_PARSE_ERROR');
        }
      } else {
        console.error('OpenAI response did not contain any JSON object. Using fallback narrative.');
        return getFallbackResponse(gameState);
      }
    }
    
    // 驗證回應格式
    if (!result.narration || !Array.isArray(result.options) || !result.effects) {
      console.error('OpenAI Invalid Format:', {
        hasNarration: !!result.narration,
        hasOptions: Array.isArray(result.options),
        hasEffects: !!result.effects,
        result: result,
      });
      throw new Error('OPENAI_INVALID_FORMAT');
    }

    // 確保至少有 2 個選項
    if (result.options.length < 2) {
      console.warn('OpenAI response has less than 2 options, adding default options', {
        originalOptions: result.options,
      });
      // 如果選項太少，補充預設選項
      result.options = [
        ...result.options,
        '繼續探索',
        '查看當前狀態',
      ].slice(0, 4); // 最多 4 個選項
    }

    return result;
  } catch (error) {
    console.error('LLM Service Error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // 降級回應
    if (error instanceof Error) {
      if (error.message.includes('429') || error.message.includes('rate limit')) {
        throw new Error('LLM_QUOTA_EXCEEDED');
      }
      if (error.message.includes('timeout')) {
        throw new Error('LLM_TIMEOUT');
      }
      // 保留 JSON 解析和格式錯誤，讓上層處理
      if (error.message === 'OPENAI_JSON_PARSE_ERROR' || error.message === 'OPENAI_INVALID_FORMAT') {
        throw error;
      }
    }
    
    // 如果 OpenAI 失敗，使用降級回應
    console.error('OpenAI failed, using fallback');
    return getFallbackResponse(gameState);
  }
}

/**
 * 生成降級回應（當 LLM 無法使用時）
 */
export function getFallbackResponse(gameState: GameState): GameTurnResult {
  return {
    narration: '劇情之神似乎暫時離開了，請稍後再試。\n\n你的冒險仍在繼續，但現在無法推進劇情。',
    options: [
      '稍後再試',
      '查看當前狀態',
    ],
    effects: {
      game_over: false,
    },
  };
}

