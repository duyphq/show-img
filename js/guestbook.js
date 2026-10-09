// Guestbook (Sổ lưu bút): guests send a wish, it is stored in Supabase (REST API, no
// extra library). Wishes are not shown on the page; read them in the Supabase dashboard.
(function () {
  var form = document.getElementById("gbForm");
  if (!form) return;
  var status = document.getElementById("gbStatus");
  var submit = form.querySelector(".gb-submit");
  var URL_ = (window.SUPABASE_URL || "").replace(/\/$/, "");
  var KEY = window.SUPABASE_ANON_KEY || "";
  var configured = URL_ && KEY;
  var headers = { apikey: KEY, "Content-Type": "application/json", Prefer: "return=minimal" };
  // legacy anon keys are JWTs and also go in Authorization; new sb_publishable_ keys must not
  if (KEY.indexOf("sb_") !== 0) headers.Authorization = "Bearer " + KEY;

  function setStatus(text, kind) {
    status.textContent = text;
    status.dataset.kind = kind || "";
  }

  if (!configured) {
    setStatus("Sổ lưu bút chưa được kết nối.", "error");
    submit.disabled = true;
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nameField = form.elements.name, messageField = form.elements.message;
    var name = nameField.value.trim();
    var message = messageField.value.trim();
    nameField.toggleAttribute("aria-invalid", !name);
    messageField.toggleAttribute("aria-invalid", !message);
    if (!name || !message) {
      setStatus("Bạn điền tên và lời chúc giúp chúng mình nhé.", "error");
      (name ? messageField : nameField).focus();
      return;
    }
    submit.disabled = true;
    setStatus("Đang gửi…", "");
    fetch(URL_ + "/rest/v1/guestbook", { method: "POST", headers: headers, body: JSON.stringify({ name: name, message: message }) })
      .then(function (r) { if (!r.ok) throw r; })
      .then(function () {
        form.reset();
        setStatus("Cảm ơn bạn. Lời chúc đã được gửi tới cô dâu chú rể.", "ok");
      })
      .catch(function () { setStatus("Gửi chưa được. Bạn thử lại sau ít phút nhé.", "error"); })
      .then(function () { submit.disabled = false; });
  });
})();
