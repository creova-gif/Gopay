import { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  BackHandler,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// Replace this with your deployed Replit app URL after deploying
const APP_URL = "https://your-gopay-app.replit.app";

export default function App() {
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  // Hide splash screen once WebView starts loading
  const handleLoadStart = () => {
    SplashScreen.hideAsync();
  };

  // Android back button: go back in WebView instead of exiting
  if (Platform.OS === "android") {
    BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      BackHandler.exitApp();
      return true;
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar style="light" backgroundColor="#080d08" />
        <WebView
          ref={webViewRef}
          source={{ uri: APP_URL }}
          style={styles.webview}
          onLoadStart={handleLoadStart}
          onNavigationStateChange={(state) => setCanGoBack(state.canGoBack)}
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled={false}
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          javaScriptEnabled
          domStorageEnabled
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          cacheEnabled
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#16a34a" />
            </View>
          )}
          startInLoadingState
          userAgent="goPay/1.0 (Mobile)"
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080d08",
  },
  webview: {
    flex: 1,
    backgroundColor: "#080d08",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#080d08",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
