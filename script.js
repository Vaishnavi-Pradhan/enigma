// Ensure Supabase is initialized AFTER the library is loaded
const SUPABASE_URL = "https://tiuymqyefsibucaxxxri.supabase.co"; // Replace with your Supabase URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpdXltcXllZnNpYnVjYXh4eHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTg1OTYsImV4cCI6MjA1MzYzNDU5Nn0.MRTDQeeSit2VF7Tsw3PWtyou64aovJLSl3EF6XSEAjE"; // Replace with your Supabase key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        // Fetch user data from Supabase
        const { data, error } = await supabase
            .from("login")
            .select("password")
            .eq("username", username)
            .single();

        if (error || !data) {
            alert("Invalid username or password.");
            return;
        }

        const hashedPassword = data.password;

        // Compare passwords using bcrypt
        const match = await bcrypt.compare(password, hashedPassword);
        if (match) {
            alert("Login successful!");
            window.location.href = "camera.html"; // Redirect to your desired page
        } else {
            alert("Invalid username or password.");
        }
    } catch (err) {
        console.error("Error logging in:", err);
        alert("Something went wrong. Please try again.");
    }
}
