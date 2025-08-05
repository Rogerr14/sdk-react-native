import Environment from "./environment/environment";







class NuveiSdk {
    private static instance: NuveiSdk;
    private environment: Environment | null = null; 

    private constructor(){
    }

    public static getInstance(): NuveiSdk{
        if(!NuveiSdk.instance){
            NuveiSdk.instance = new NuveiSdk;
        }
        return NuveiSdk.instance;
    }


    public initEnvironmet(
        appCode: string,
        appKey: string,
        serverCode: string,
        serverKey: string,
        testMode: boolean,
    ):void{

        
        Environment.getInstance().initConfig(appCode, appKey, serverCode, serverKey, testMode);
        // this.environment?.initConfig(appCode, appKey, serverCode, serverKey, testMode);
        this.environment = Environment.getInstance();
        console.log('Ambiente inicializado', this.environment.baseConfig?.urlBase)
    }



   



    
}

export default NuveiSdk.getInstance();