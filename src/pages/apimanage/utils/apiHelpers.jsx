// Mock 응답 생성
const generateMockResponse = (model, params) => {
  const baseResponse = {
    success: true,
    model_id: model.id,
    model_version: model.version,
    timestamp: new Date().toISOString(),
    processing_time_ms: Math.floor(Math.random() * 500) + 100
  };

  switch(model.id) {
    case "m1":
      return {
        ...baseResponse,
        classification: {
          sentiment: "positive",
          confidence: 0.87,
          categories: ["entertainment", "positive_review"]
        },
        input_text: params.text || params.input
      };
    case "m2":
      return {
        ...baseResponse,
        response: "안녕하세요! 무엇을 도와드릴까요?",
        intent: "greeting",
        confidence: 0.95,
        suggested_actions: ["help_request", "product_inquiry"]
      };
    case "m3":
      return {
        ...baseResponse,
        recommendations: [
          { item_id: "item001", score: 0.92, category: "electronics" },
          { item_id: "item045", score: 0.88, category: "books" },
          { item_id: "item123", score: 0.84, category: "electronics" }
        ],
        user_profile: {
          preferences: params.item_categories || ["general"],
          interaction_count: 47
        }
      };
    case "m4":
      return {
        ...baseResponse,
        detections: [
          { class: "cat", confidence: 0.94, bbox: [10, 20, 150, 200] },
          { class: "person", confidence: 0.87, bbox: [200, 50, 300, 400] }
        ],
        image_info: {
          width: 640,
          height: 480,
          format: "jpeg"
        }
      };
    case "m5":
      return {
        ...baseResponse,
        translated_text: "안녕하세요, 오늘 어떻게 지내세요?",
        source_language: params.source_lang || "en",
        target_language: params.target_lang || "ko",
        confidence: 0.96
      };
    case "m6":
      return {
        ...baseResponse,
        summary: "입력된 텍스트의 핵심 내용을 요약한 결과입니다.",
        original_length: params.text?.length || 0,
        summary_length: 25,
        compression_ratio: 0.75
      };
    default:
      return {
        ...baseResponse,
        result: "처리 완료",
        data: params
      };
  }
};

// localStorage 관련 함수들
const saveApiResult = (result) => {
  const results = JSON.parse(localStorage.getItem("apiResults") || "[]");
  results.push(result);
  localStorage.setItem("apiResults", JSON.stringify(results));
  return results;
};

const loadApiResults = () => {
  return JSON.parse(localStorage.getItem("apiResults") || "[]");
};

const deleteApiResult = (index) => {
  const results = loadApiResults();
  results.splice(index, 1);
  localStorage.setItem("apiResults", JSON.stringify(results));
  return results;
};

const clearAllApiResults = () => {
  localStorage.removeItem("apiResults");
};

// Default export
export default {
  generateMockResponse,
  saveApiResult,
  loadApiResults,
  deleteApiResult,
  clearAllApiResults
};