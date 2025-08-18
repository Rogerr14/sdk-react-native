
import { Modal, View, Button, SafeAreaView } from "react-native";
import { WebView, type WebViewNavigation } from "react-native-webview";

type ChallengeModalProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: (response: any) => void;
};

export default function ChallengeModal({
  visible,
  onClose,
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

  const challengeHtml = `<!DOCTYPE html SYSTEM 'about:legacy-compat'><html class='no-js' lang='en'xmlns='http://www.w3.org/1999/xhtml'><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'/><meta charset='utf-8'/></head><body OnLoad='OnLoadEvent();'><form action='https://ccapi-stg.paymentez.com/v2/3ds/mockchallenge' method='POST' id='threeD' name='threeD'>message_id: <input type='area' id='message_id' name='message_id' value='AU-106430' />;creq: <input type='area' id='creq'name='creq' value='ewogICAiYWNzVHJhbnNJRCIgOiAiMjZjZGI3ZjAtOTE0My00M2I0LTlhM2YtYWUwZWE1MzUyMzhjIiwKICA' />; \"term_url: <input type='area' id='term_url' name='term_url' value='https://lantechco.ec/img/callback3DS.php' />;\n            <input type='submit' value='proceed to issuer'></form><script language='Javascript'>document.getElementById('threeD').submit(); </script></body></body></html>`;

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
