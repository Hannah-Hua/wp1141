import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

interface Player {
  x: number;
  y: number;
  velocityY: number;
  velocityX: number;
  width: number;
  height: number;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GAME_WIDTH = 360;
const GAME_HEIGHT = 640;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const PLAYER_SPEED = 16; // 從 8 增加到 16，讓移動距離再變為兩倍
const PLATFORM_WIDTH = 60;
const PLATFORM_HEIGHT = 15;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'playing' | 'gameOver'>('playing');
  const [score, setScore] = useState(0);
  const [highestY, setHighestY] = useState(GAME_HEIGHT - 100); // 記錄最高位置
  const [cameraY, setCameraY] = useState(0); // 相機Y偏移量
  const [targetCameraY, setTargetCameraY] = useState(0); // 目標相機位置
  const [lastJumpY, setLastJumpY] = useState(GAME_HEIGHT - 100); // 記錄上次跳躍的Y位置
  const [isCameraMoving, setIsCameraMoving] = useState(false); // 相機是否正在移動
  const [player, setPlayer] = useState<Player>({
    x: GAME_WIDTH / 2 - 15,
    y: GAME_HEIGHT - 100,
    velocityY: 0,
    velocityX: 0,
    width: 30,
    height: 30
  });
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  // 初始化平台
  useEffect(() => {
    const initialPlatforms: Platform[] = [];
    
    // 底部平台
    initialPlatforms.push({
      x: GAME_WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: GAME_HEIGHT - 50,
      width: PLATFORM_WIDTH,
      height: PLATFORM_HEIGHT
    });

    // 生成隨機平台
    for (let i = 0; i < 20; i++) {
      initialPlatforms.push({
        x: Math.random() * (GAME_WIDTH - PLATFORM_WIDTH),
        y: GAME_HEIGHT - 100 - (i * 80),
        width: PLATFORM_WIDTH,
        height: PLATFORM_HEIGHT
      });
    }

    setPlatforms(initialPlatforms);
  }, []);

  // 鍵盤事件處理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // 碰撞檢測
  const checkCollision = (player: Player, platform: Platform): boolean => {
    return (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y + player.height >= platform.y &&
      player.y + player.height <= platform.y + platform.height + 5 &&
      player.velocityY > 0
    );
  };

  // 遊戲主循環 - 直接更新狀態，避免在 requestAnimationFrame 中使用 setState
  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer };

      // 處理水平移動
      if (keys['a'] || keys['A'] || keys['ArrowLeft']) {
        newPlayer.velocityX = -PLAYER_SPEED;
      } else if (keys['d'] || keys['D'] || keys['ArrowRight']) {
        newPlayer.velocityX = PLAYER_SPEED;
      } else {
        newPlayer.velocityX = 0;
      }

      // 應用重力
      newPlayer.velocityY += GRAVITY;

      // 更新位置
      newPlayer.x += newPlayer.velocityX;
      newPlayer.y += newPlayer.velocityY;

      // 水平環繞
      if (newPlayer.x < -newPlayer.width) {
        newPlayer.x = GAME_WIDTH;
      } else if (newPlayer.x > GAME_WIDTH) {
        newPlayer.x = -newPlayer.width;
      }

      // 檢查平台碰撞
      let jumpedToNewPlatform = false;
      platforms.forEach(platform => {
        if (checkCollision(newPlayer, platform)) {
          newPlayer.velocityY = JUMP_FORCE;
          newPlayer.y = platform.y - newPlayer.height;
          jumpedToNewPlatform = true;
        }
      });

      // 如果成功跳到新平台，計算跳躍距離並移動相機
      if (jumpedToNewPlatform && newPlayer.y < lastJumpY) {
        const jumpDistance = lastJumpY - newPlayer.y; // 跳躍距離
        const newTargetCameraY = targetCameraY - jumpDistance; // 相機移動相同距離
        setTargetCameraY(newTargetCameraY);
        setLastJumpY(newPlayer.y); // 更新上次跳躍位置
        setIsCameraMoving(true); // 標記相機開始移動
      }

      // 檢查 Game Over：當玩家掉到相機視野下方時
      if (newPlayer.y > GAME_HEIGHT + cameraY) {
        setGameState('gameOver');
      }

      // 更新最高位置和分數
      if (newPlayer.y < highestY) {
        setHighestY(newPlayer.y);
        // 分數基於跳躍高度：從起始位置到最高位置的距離
        const jumpHeight = (GAME_HEIGHT - 100) - newPlayer.y;
        const newScore = Math.max(0, Math.floor(jumpHeight / 10));
        setScore(newScore);
      }

      // 持續生成新平台
      setPlatforms(prevPlatforms => {
        const newPlatforms = [...prevPlatforms];
        
        // 移除在相機視野下方的平台
        const filteredPlatforms = newPlatforms.filter(platform => 
          platform.y > cameraY - 200 && platform.y < cameraY + GAME_HEIGHT + 200
        );
        
        // 如果平台不夠，添加新平台
        const highestPlatform = Math.min(...filteredPlatforms.map(p => p.y));
        if (highestPlatform > cameraY - 100) {
          for (let i = 0; i < 5; i++) {
            filteredPlatforms.push({
              x: Math.random() * (GAME_WIDTH - PLATFORM_WIDTH),
              y: highestPlatform - 80 - (i * 80),
              width: PLATFORM_WIDTH,
              height: PLATFORM_HEIGHT
            });
          }
        }
        
        return filteredPlatforms;
      });

      return newPlayer;
    });
  }, [gameState, keys, platforms, cameraY, lastJumpY, targetCameraY, highestY]);

  // 統一的遊戲循環 - 使用 requestAnimationFrame
  useEffect(() => {
    let animationId: number;
    
    const unifiedGameLoop = () => {
      if (gameState === 'playing') {
        // 執行遊戲邏輯
        gameLoop();
        
        // 執行相機平滑移動
        setCameraY(prevCameraY => {
          const diff = targetCameraY - prevCameraY;
          if (Math.abs(diff) > 0.5) {
            const newCameraY = prevCameraY + diff * 0.15; // 稍微加快移動速度
            return newCameraY;
          } else {
            setIsCameraMoving(false); // 相機移動完成
            return targetCameraY;
          }
        });
      }
      
      // 繼續下一幀
      animationId = requestAnimationFrame(unifiedGameLoop);
    };
    
    // 開始動畫循環
    animationId = requestAnimationFrame(unifiedGameLoop);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameState, gameLoop, targetCameraY]);

  // 重新開始遊戲
  const restartGame = () => {
    setGameState('playing');
    setScore(0);
    setHighestY(GAME_HEIGHT - 100); // 重置最高位置
    setCameraY(0); // 重置相機位置
    setTargetCameraY(0); // 重置目標相機位置
    setLastJumpY(GAME_HEIGHT - 100); // 重置上次跳躍位置
    setIsCameraMoving(false); // 重置相機移動狀態
    setPlayer({
      x: GAME_WIDTH / 2 - 15,
      y: GAME_HEIGHT - 100,
      velocityY: 0,
      velocityX: 0,
      width: 30,
      height: 30
    });
    
    // 重新生成平台
    const initialPlatforms: Platform[] = [];
    initialPlatforms.push({
      x: GAME_WIDTH / 2 - PLATFORM_WIDTH / 2,
      y: GAME_HEIGHT - 50,
      width: PLATFORM_WIDTH,
      height: PLATFORM_HEIGHT
    });

    for (let i = 0; i < 20; i++) {
      initialPlatforms.push({
        x: Math.random() * (GAME_WIDTH - PLATFORM_WIDTH),
        y: GAME_HEIGHT - 100 - (i * 80),
        width: PLATFORM_WIDTH,
        height: PLATFORM_HEIGHT
      });
    }
    setPlatforms(initialPlatforms);
  };

  return (
    <div className="game-container">
      <div className="game-canvas" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
        <div className="score">分數: {score}</div>
        
        {/* 遊戲世界容器，應用相機偏移 */}
        <div 
          className="game-world"
          style={{
            transform: `translateY(${-cameraY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        >
          {/* 玩家 */}
          <div
            className={`player ${isCameraMoving ? 'camera-moving' : ''}`}
            style={{
              left: player.x,
              top: player.y,
              width: player.width,
              height: player.height
            }}
          />

          {/* 平台 */}
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="platform"
              style={{
                left: platform.x,
                top: platform.y,
                width: platform.width,
                height: platform.height
              }}
            />
          ))}
        </div>

        {/* Game Over 畫面 */}
        {gameState === 'gameOver' && (
          <div className="game-over">
            <h2>遊戲結束！</h2>
            <p>最終分數: {score}</p>
            <button onClick={restartGame} className="restart-button">
              重新開始
            </button>
          </div>
        )}

        {/* 控制說明 */}
        <div className="controls">
          <p>使用方向鍵控制移動</p>
        </div>
      </div>
    </div>
  );
};

export default App;
