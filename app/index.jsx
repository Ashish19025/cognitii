import { useState } from "react";
import { View } from "react-native";
import GameScreen from "../components/GameScreen";
import ResultScreen from "../components/ResultScreen";
import StartScreen from "../components/StartScreen";

export default function App() {
  const [gameState, setGameState] = useState("START");
  const [captureMode, setCaptureMode] = useState("NONE");
  const [sessionResults, setSessionResults] = useState(null);

  const resetToStart = () => {
    setGameState("START");
    setSessionResults(null);
  };

  return (
    <View className="flex-1 bg-slate-900">
      {/* Core Game UI Engine */}
      {gameState === "START" && (
        <StartScreen
          captureMode={captureMode}
          setCaptureMode={setCaptureMode}
          onStartGame={() => setGameState("PLAYING")}
        />
      )}

      {gameState === "PLAYING" && (
        <GameScreen
          captureMode={captureMode}
          setIsPlaying={(playing) => {
            if (!playing) setGameState("RESULT");
          }}
          onGameOver={(res) => {
            setSessionResults(res);
            setGameState("RESULT");
          }}
          onGoHome={resetToStart}
        />
      )}

      {gameState === "RESULT" && sessionResults && (
        <ResultScreen
          sessionResults={sessionResults}
          captureMode={captureMode}
          onPlayAgain={resetToStart}
          onGoHome={resetToStart}
        />
      )}
    </View>
  );
}
