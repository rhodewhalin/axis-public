/* AXIS 학습 세션 — 용어사전 자동 링크
 * 본문에서 용어사전 등록 용어의 "페이지당 첫 등장"에 회색 점선 밑줄 링크를 달아
 * 09-glossary.html의 해당 정의 블록(#앵커)으로 이동시킨다.
 * 제외 영역: 제목, 코드, 기존 링크, 퀴즈, 페이저, 심화 박스. 용어사전 페이지 자신도 제외.
 */
(function () {
  if (location.pathname.indexOf('09-glossary') !== -1) return;

  /* [용어, 앵커] — 긴 용어 우선 매칭. 같은 앵커의 별칭은 첫 성공 후 건너뜀. */
  var TERMS = [
    ['테스트타임 컴퓨트', 'g-ttc'],
    ['OpenAI 호환 API', 'g-openai-api'],
    ['TensorRT-LLM', 'g-engines'],
    ['컨텍스트 윈도우', 'g-context'],
    ['메모리 대역폭', 'g-bandwidth'],
    ['명령어 규격', 'g-isa'],
    ['RISC-V', 'g-isa'],
    ['데이터베이스', 'g-db'],
    ['HuggingFace', 'g-hf'],
    ['safetensors', 'g-safetensors'],
    ['LLM-as-judge', 'g-judge'],
    ['시스템 프롬프트', 'g-prompt'],
    ['합성 데이터', 'g-synthetic'],
    ['검증 게이트', 'g-gate'],
    ['도구 호출', 'g-toolcall'],
    ['워크플로우', 'g-forms'],
    ['에이전트', 'g-forms'],
    ['하네싱', 'g-harness'],
    ['골든셋', 'g-goldenset'],
    ['오프로딩', 'g-offloading'],
    ['컴파일러', 'g-compiler'],
    ['파인튜닝', 'g-finetune'],
    ['임베딩', 'g-embedding'],
    ['벡터 DB', 'g-vectordb'],
    ['재랭킹', 'g-rerank'],
    ['파운드리', 'g-foundry'],
    ['팹리스', 'g-foundry'],
    ['오픈소스', 'g-opensource'],
    ['파라미터', 'g-param'],
    ['정규식', 'g-regex'],
    ['터미널', 'g-terminal'],
    ['드라이버', 'g-driver'],
    ['양자화', 'g-quant'],
    ['대역폭', 'g-bandwidth'],
    ['어텐션', 'g-attention'],
    ['배칭', 'g-batching'],
    ['환각', 'g-hallucination'],
    ['서버', 'g-server'],
    ['토큰', 'g-token'],
    ['서빙', 'g-serving'],
    ['Transformer', 'g-transformer'],
    ['LM Studio', 'g-lmstudio'],
    ['llama.cpp', 'g-llamacpp'],
    ['thinking', 'g-thinking'],
    ['KV 캐시', 'g-kv'],
    ['Prefill', 'g-prefill'],
    ['Q4_K_M', 'g-q4'],
    ['Ollama', 'g-ollama'],
    ['Docker', 'g-docker'],
    ['도커', 'g-docker'],
    ['GPTQ', 'g-gptq'],
    ['GGUF', 'g-gguf'],
    ['CUDA', 'g-cuda'],
    ['FP16', 'g-fp16'],
    ['VRAM', 'g-vram'],
    ['vLLM', 'g-vllm'],
    ['TOPS', 'g-tops'],
    ['MoE', 'g-moe'],
    ['HBM', 'g-hbm'],
    ['n8n', 'g-n8n'],
    ['RAG', 'g-rag'],
    ['SDK', 'g-sdk'],
    ['NPU', 'g-npu'],
    ['API', 'g-api'],
    ['k8s', 'g-k8s'],
    ['DB', 'g-db']
  ];

  var SKIP = 'a, code, pre, h1, h2, h3, script, style, .badge, .topnav, .pager, #quiz, .quiz-shell, .further, .mod-num, .gloss-item, input, button, select, textarea, label';

  function isWordChar(ch) { return /[A-Za-z0-9]/.test(ch || ''); }

  document.addEventListener('DOMContentLoaded', function () {
    var wrap = document.querySelector('.wrap');
    if (!wrap) return;
    var linked = {};

    TERMS.forEach(function (pair) {
      var term = pair[0], anchor = pair[1];
      if (linked[anchor]) return;

      var walker = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          if (!node.nodeValue || node.nodeValue.indexOf(term) === -1) return NodeFilter.FILTER_REJECT;
          var p = node.parentElement;
          if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      var node;
      while ((node = walker.nextNode())) {
        var text = node.nodeValue;
        var i = text.indexOf(term);
        /* 영문·숫자 용어는 단어 경계 확인 (예: RAM이 VRAM 내부에 걸리지 않게) */
        while (i !== -1 && (isWordChar(text[i - 1]) || isWordChar(text[i + term.length]))) {
          i = text.indexOf(term, i + 1);
        }
        if (i === -1) continue;
        var after = node.splitText(i);
        after.splitText(term.length);
        var a = document.createElement('a');
        a.className = 'gloss-link';
        a.id = 'ref-' + anchor;
        var page = location.pathname.split('/').pop() || 'index.html';
        a.href = '09-glossary.html?back=' + encodeURIComponent(page + '#ref-' + anchor) + '#' + anchor;
        a.title = '용어사전에서 이 용어 보기 (읽던 곳으로 돌아오기 버튼이 제공됩니다)';
        a.textContent = term;
        after.parentNode.replaceChild(a, after);
        linked[anchor] = true;
        break;
      }
    });
  });
})();
