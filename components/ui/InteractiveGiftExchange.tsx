import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Sparkles } from 'lucide-react';

const InteractiveGiftExchange = () => {
  const [names, setNames] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [remainingReceivers, setRemainingReceivers] = useState([]);
  const [results, setResults] = useState([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameState, setGameState] = useState('input'); // input, drawing, finished
  const [spinningNames, setSpinningNames] = useState([]);
  const [firstDrawer, setFirstDrawer] = useState('');

  // 初始化抽籤
  const startGame = () => {
    const nameList = inputText.split('\n')
      .map(name => name.trim())
      .filter(name => name);
    
    if (nameList.length < 2) {
      alert('請至少輸入兩個名字！');
      return;
    }

    if (!firstDrawer || !nameList.includes(firstDrawer)) {
      alert('請選擇有效的第一位抽籤者！');
      return;
    }

    setNames(nameList);
    setRemainingReceivers(nameList);
    setCurrentDrawer(firstDrawer);
    setGameState('drawing');
    setResults([]);
  };

  // 模擬抽籤動畫
  useEffect(() => {
    if (isSpinning) {
      const interval = setInterval(() => {
        const availableNames = remainingReceivers.filter(name => 
          name !== currentDrawer && 
          (remainingReceivers.length > 2 || name !== results[0]?.giver)
        );
        setSpinningNames([...availableNames].sort(() => Math.random() - 0.5).slice(0, 3));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isSpinning, remainingReceivers, currentDrawer, results]);

  // 抽籤邏輯
  const draw = () => {
    setIsSpinning(true);

    setTimeout(() => {
      const availableNames = remainingReceivers.filter(name => 
        name !== currentDrawer && 
        (remainingReceivers.length > 2 || name !== results[0]?.giver)
      );
      
      const receiverIndex = Math.floor(Math.random() * availableNames.length);
      const receiver = availableNames[receiverIndex];
      
      setResults([...results, { giver: currentDrawer, receiver }]);
      setRemainingReceivers(remainingReceivers.filter(name => name !== receiver));
      
      // 設定下一個抽籤者為被抽到的人
      if (results.length + 1 === names.length) {
        setGameState('finished');
      } else {
        setCurrentDrawer(receiver);
      }
      
      setIsSpinning(false);
      setSpinningNames([]);
    }, 2000);
  };

  // 重置遊戲
  const reset = () => {
    setInputText('');
    setNames([]);
    setCurrentDrawer(null);
    setRemainingReceivers([]);
    setResults([]);
    setGameState('input');
    setIsSpinning(false);
    setSpinningNames([]);
    setFirstDrawer('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gift className="w-6 h-6" />
          <h2 className="text-xl font-bold">交換禮物抽籤</h2>
        </div>

        {gameState === 'input' && (
          <>
            <div className="mb-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="請輸入參加者名字，一行一個名字&#10;例如：&#10;小明&#10;小華&#10;小美"
                className="w-full h-40 p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <select
                value={firstDrawer}
                onChange={(e) => setFirstDrawer(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">選擇第一位抽籤者</option>
                {inputText.split('\n')
                  .map(name => name.trim())
                  .filter(name => name)
                  .map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))
                }
              </select>
            </div>
            <Button 
              className="w-full"
              onClick={startGame}
            >
              開始抽籤
            </Button>
          </>
        )}

        {gameState === 'drawing' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                現在輪到 <span className="text-blue-600">{currentDrawer}</span> 抽籤
              </h3>
              
              <div className="min-h-[100px] flex items-center justify-center">
                {isSpinning ? (
                  <div className="space-y-2">
                    <Sparkles className="w-6 h-6 mx-auto animate-spin text-yellow-500" />
                    <div className="animate-pulse">
                      {spinningNames.map((name, index) => (
                        <div key={index} className="text-lg">{name}</div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Button 
                    className="px-8"
                    onClick={draw}
                    disabled={isSpinning}
                  >
                    抽籤
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">抽籤順序和結果：</h4>
              {results.map(({giver, receiver}, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 rounded-lg flex justify-between items-center"
                >
                  <span>{index + 1}. {giver} → {receiver}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-center mb-4">
              抽籤完成！
            </h3>
            
            <div className="space-y-2">
              {results.map(({giver, receiver}, index) => (
                <div
                  key={index}
                  className="p-3 bg-green-50 rounded-lg flex justify-between items-center"
                >
                  <span>{index + 1}. {giver} → {receiver}</span>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={reset}
            >
              重新開始
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveGiftExchange;