export declare class OpenApi {
    $gateway: string;
    $appSecret: string;
    /**
     * 生成提交结果参数
     * @param $commonData 公共参数
     * @param array $bizContent 业务参数
     * @return bool|string
     * @throws Exception
     */
    actionApi($commonData: any, $bizContent?: {}): Promise<unknown>;
    /**
     * 生成签名
     * @param $data
     * @return string
     */
    getSign($data: any, appSecret?: string): string;
    md5(txt: any): string;
    /**
     * 提交提交结果
     * @param $url 网关地址
     * @param array $data 请求参数
     * @param int $timeout 超时时间
     * @return bool|string
     * @throws Exception
     */
    curlPostContents($url: any, $data?: {}, $timeout?: number): Promise<unknown>;
}
