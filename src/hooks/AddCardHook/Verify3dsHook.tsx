
import { Modal, View, Button } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";

type ChallengeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: (response: any) => void;
  challengeHtml: string
};

export default function ChallengeModal({
  visible,
  onClose,
  challengeHtml
  // onSuccess,
}: ChallengeModalProps) {

  const handleNavigation = (event: WebViewNavigation) => {


    if (event.url.includes("callback3DS.php")) {
      try {
        // const query = event.url.split("?")[1];
        // const params = new URLSearchParams(query);
        // const response = Object.fromEntries(params.entries());
        
        onClose();
        return false; // detener navegación
      } catch (err) {
        console.error(" Error try parsing url :", err);
      }
    }

    return true;
  };

  

  return (
    <Modal visible={visible} animationType="slide" >
        <View style={{flex:1, paddingVertical:'15%', paddingHorizontal:'5%'}}>

        <WebView
        
        originWhitelist={["*"]}
        source={{ html: challengeHtml }}
        onNavigationStateChange={handleNavigation}
        
        // onLoadEnd={() => setLoading(false)}
        />
        <Button title="Cerrar" onPress={onClose} />
    
        </View>
          
    </Modal>
  );
}
