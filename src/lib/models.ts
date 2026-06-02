// 厂商配置：一个 Key 对应一个厂商，该厂商下所有模型通用
export const PROVIDERS = {
  deepseek: {
    name: "DeepSeek",
    baseURL: "https://api.deepseek.com/v1",
    envKey: "DEEPSEEK_API_KEY",
    models: [
      { id: "deepseek-chat", name: "DeepSeek-V3" },
      { id: "deepseek-reasoner", name: "DeepSeek-R1" },
      { id: "deepseek-coder", name: "DeepSeek-Coder" },
    ],
  },
  qwen: {
    name: "阿里 Qwen",
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    envKey: "QWEN_API_KEY",
    models: [
      { id: "qwen-max", name: "Qwen-Max" },
      { id: "qwen-plus", name: "Qwen-Plus" },
      { id: "qwen-turbo", name: "Qwen-Turbo" },
      { id: "qwen-coder-plus", name: "Qwen-Coder-Plus" },
      { id: "qwen-math-plus", name: "Qwen-Math-Plus" },
    ],
  },
  glm: {
    name: "智谱 GLM",
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    envKey: "GLM_API_KEY",
    models: [
      { id: "glm-4", name: "GLM-4" },
      { id: "glm-4-plus", name: "GLM-4-Plus" },
      { id: "glm-4-flash", name: "GLM-4-Flash" },
      { id: "glm-4v", name: "GLM-4V" },
      { id: "chatglm-3-turbo", name: "ChatGLM3-Turbo" },
    ],
  },
  baidu: {
    name: "百度",
    baseURL: "https://qianfan.baidubce.com/v2",
    envKey: "BAIDU_API_KEY",
    models: [
      { id: "ernie-bot-4", name: "ERNIE-Bot-4" },
      { id: "ernie-bot-8k", name: "ERNIE-Bot-8K" },
      { id: "ernie-speed", name: "ERNIE-Speed" },
    ],
  },
  doubao: {
    name: "字节豆包",
    baseURL: "https://ark.cn-beijing.volces.com/api/v3",
    envKey: "DOUBAO_API_KEY",
    models: [
      { id: "doubao-pro", name: "Doubao-Pro" },
      { id: "doubao-lite", name: "Doubao-Lite" },
      { id: "doubao-vision", name: "Doubao-Vision" },
    ],
  },
  minimax: {
    name: "MiniMax",
    baseURL: "https://api.minimax.chat/v1",
    envKey: "MINIMAX_API_KEY",
    models: [
      { id: "abab6.5s", name: "MiniMax-6.5s" },
      { id: "abab6", name: "MiniMax-6" },
      { id: "abab5.5", name: "MiniMax-5.5" },
    ],
  },
  yi: {
    name: "零一万物",
    baseURL: "https://api.lingyiwanwu.com/v1",
    envKey: "YI_API_KEY",
    models: [
      { id: "yi-large", name: "Yi-Large" },
      { id: "yi-medium", name: "Yi-Medium" },
      { id: "yi-vision", name: "Yi-Vision" },
    ],
  },
  kimi: {
    name: "月之暗面",
    baseURL: "https://api.moonshot.cn/v1",
    envKey: "KIMI_API_KEY",
    models: [
      { id: "kimi-latest", name: "Kimi-Latest" },
      { id: "kimi-pro", name: "Kimi-Pro" },
      { id: "kimi-lite", name: "Kimi-Lite" },
    ],
  },
  spark: {
    name: "讯飞",
    baseURL: "https://spark-api-open.xf-yun.com/v1",
    envKey: "SPARK_API_KEY",
    models: [
      { id: "spark-v3.5", name: "Spark-V3.5" },
      { id: "spark-v3", name: "Spark-V3" },
      { id: "spark-pro", name: "Spark-Pro" },
    ],
  },
};

// 根据模型 ID 获取配置
export function getModelConfig(modelId: string) {
  for (const [providerKey, provider] of Object.entries(PROVIDERS)) {
    const model = provider.models.find((m) => m.id === modelId);
    if (model) {
      return {
        provider: providerKey,
        providerName: provider.name,
        baseURL: provider.baseURL,
        apiKey: process.env[provider.envKey] || "",
        modelId: model.id,
        modelName: model.name,
      };
    }
  }
  return null;
}

// 获取所有模型列表（用于前端下拉框）
export function getAllModels() {
  const result: Array<{
    provider: string;
    providerName: string;
    id: string;
    name: string;
  }> = [];

  for (const [providerKey, provider] of Object.entries(PROVIDERS)) {
    for (const model of provider.models) {
      result.push({
        provider: providerKey,
        providerName: provider.name,
        id: model.id,
        name: model.name,
      });
    }
  }

  return result;
}
