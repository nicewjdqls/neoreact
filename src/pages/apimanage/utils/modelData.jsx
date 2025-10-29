// 모델 리스트 정의
const MODEL_LIST = [
  {
    id: "m1",
    name: "텍스트 분류 모델",
    description: "텍스트의 감정, 주제, 카테고리를 분류합니다",
    version: "v2.1",
    endpoint: "/api/v1/classify",
    category: "NLP",
    sampleParams: {
      text: "이 영화 정말 재미있어요!",
      max_categories: 3
    }
  },
  {
    id: "m2",
    name: "대화형 AI 모델",
    description: "자연스러운 대화를 생성합니다",
    version: "v3.0",
    endpoint: "/api/v1/chat",
    category: "NLP",
    sampleParams: {
      message: "안녕하세요",
      context: "customer_support"
    }
  },
  {
    id: "m3",
    name: "추천 시스템",
    description: "사용자 기반 맞춤 추천을 제공합니다",
    version: "v1.5",
    endpoint: "/api/v1/recommend",
    category: "Recommendation",
    sampleParams: {
      user_id: "user123",
      item_categories: ["electronics", "books"],
      limit: 10
    }
  },
  {
    id: "m4",
    name: "이미지 인식 모델",
    description: "이미지에서 객체를 탐지하고 분류합니다",
    version: "v2.0",
    endpoint: "/api/v1/detect",
    category: "Computer Vision",
    sampleParams: {
      image_url: "https://example.com/image.jpg",
      confidence_threshold: 0.7
    }
  },
  {
    id: "m5",
    name: "번역 모델",
    description: "다국어 번역을 지원합니다",
    version: "v1.8",
    endpoint: "/api/v1/translate",
    category: "NLP",
    sampleParams: {
      text: "Hello, how are you?",
      source_lang: "en",
      target_lang: "ko"
    }
  },
  {
    id: "m6",
    name: "요약 생성 모델",
    description: "긴 텍스트를 간결하게 요약합니다",
    version: "v1.3",
    endpoint: "/api/v1/summarize",
    category: "NLP",
    sampleParams: {
      text: "긴 텍스트 내용...",
      max_length: 100,
      style: "bullet_points"
    }
  }
];

// 모델별 샘플 파라미터 가져오기
const getModelSampleParams = (modelId) => {
  const model = MODEL_LIST.find(m => m.id === modelId);
  return model ? model.sampleParams : {};
};

// 모델 정보 가져오기
const getModelById = (modelId) => {
  return MODEL_LIST.find(m => m.id === modelId);
};

// Default export
export default {
  MODEL_LIST,
  getModelSampleParams,
  getModelById
};