const button = document.querySelector(".menu");
const links = document.querySelector(".links");
button.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  button.setAttribute("aria-expanded", String(open));
  button.textContent = open ? "Close" : "Menu";
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "Menu";
  }),
);
const form = document.querySelector("#inquiry-form");
if (form) {
  let sending = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    const status = form.querySelector(".status");
    if (form.hasAttribute("data-direct-submit")) {
      const submit = form.querySelector('button[type="submit"]');
      const label = submit.textContent;
      sending = true;
      submit.disabled = true;
      submit.textContent = "Sending…";
      form.setAttribute("aria-busy", "true");
      status.textContent = "Sending your career inquiry…";
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          let result = {};
          try {
            result = await response.json();
          } catch (_) {}
          const details = Array.isArray(result.errors)
            ? result.errors
                .map((error) => error.message)
                .filter(Boolean)
                .join(" ")
            : "";
          throw new Error(
            details || "Your inquiry could not be submitted. Please try again.",
          );
        }
        form.reset();
        status.textContent =
          "Thank you. Your career inquiry has been received. Ascend will review your information.";
      } catch (error) {
        status.textContent =
          error instanceof TypeError
            ? "We could not confirm delivery. Check your connection and try again. Your information remains in the form."
            : error.message;
      } finally {
        sending = false;
        submit.disabled = false;
        submit.textContent = label;
        form.removeAttribute("aria-busy");
      }
      return;
    }
    const subject = "Security evaluation — " + data.get("organization");
    const body =
      "Name: " +
      data.get("name") +
      "\nOrganization: " +
      data.get("organization") +
      "\nEmail: " +
      data.get("email") +
      "\n\n" +
      data.get("message");
    window.location.href =
      "mailto:operations@ascendsecurityservices.com?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body);
    status.textContent =
      "Your email application will open. Send the draft there to complete your inquiry.";
  });
}
