// 🔑 Replace with your Supabase details
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_KEY = "your-anon-public-key";

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Handle form submit
document.querySelector("form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const name = document.querySelector("input[name='name']").value;
  const email = document.querySelector("input[name='email']").value;
  const message = document.querySelector("textarea[name='message']").value;

  try {
    const { error } = await supabase
      .from("contacts")
      .insert([{ name, email, message }]);

    if (error) throw error;

    alert("✅ Message sent successfully!");
    document.querySelector("form").reset();

  } catch (err) {
    console.error(err);
    alert("❌ Error sending message");
  }
});