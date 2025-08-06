import type { ConfigBase } from "./base_config";
import ProdEnv from "./prod_env";
import TestEnv from "./test_env";


export default class Environment{

   private static _environment:Environment;

    static dev: string = 'DEV';
    static prod: string = 'PROD';

   private  _appCode: string = '';
   private _appKey: string = '';
   private _serverCode: string = '';
   private _serverKey: string = '';
   
   public get serverCode(): string {
     return this._serverCode;
   }

   public get appCode(): string{
    return this._appCode;
   }

   public get appKey(): string{
    return this._appKey;
   }

   public get serverKey(): string{
    return this._serverKey;
   }

    public baseConfig?: ConfigBase


    public static getInstance(): Environment {
        if (!Environment._environment) {
          Environment._environment = new Environment();
        }
        return Environment._environment;
      }

      public initConfig(
        appCode: string,
        appKey: string,
        serverCode: string,
        serverKey: string,
        testMode: boolean
      ): void{
        this._appCode = appCode;
        this._appKey = appKey;
        this._serverCode = serverCode;
        this._serverKey = serverKey;

        this.baseConfig = this._getConfig(testMode ? Environment.dev : Environment.dev)

        console.log(`Environment app code ${appCode}`)
      }


    private _getConfig(environment: string): ConfigBase{
        switch (environment) {
            case Environment.dev:
                return new TestEnv();
                
            case Environment.prod:
                return new ProdEnv();
        
            default:
                return new TestEnv();
        }
    }



}