import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";
import { MOCK_PROPERTIES } from "./mockData";

const ToastCtx = createContext(null);
const AuthCtx = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={add}>
      {children}
      <div
        style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "12px 18px",
              border: "2px solid #1A1612",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              boxShadow: "4px 4px 0px #1A1612",
              maxWidth: 320,
              animation: "slideIn .2s ease",
              background:
                t.type === "success"
                  ? "#1A1612"
                  : t.type === "error"
                    ? "#C4411C"
                    : "#F5F0E8",
              color:
                t.type === "success"
                  ? "#F5F0E8"
                  : t.type === "error"
                    ? "#fff"
                    : "#1A1612",
            }}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [favs, setFavs] = useState({});

  const login = (email, password) => {
    if (!email || !password) throw new Error("Invalid credentials");
    const u = {
      name: email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: "buyer",
    };
    setUser(u);
    return u;
  };
  const register = (name, email, password) => {
    const u = { name, email, role: "buyer" };
    setUser(u);
    return u;
  };
  const logout = () => {
    setUser(null);
    setFavs({});
  };
  const toggleFav = (id) => setFavs((f) => ({ ...f, [id]: !f[id] }));

  return (
    <AuthCtx.Provider
      value={{ user, login, register, logout, favs, toggleFav }}
    >
      {children}
    </AuthCtx.Provider>
  );
}
const useAuth = () => useContext(AuthCtx);

function useRoute() {
  const [route, setRoute] = useState({ page: "home", param: null });
  const navigate = useCallback(
    (page, param = null) => setRoute({ page, param }),
    [],
  );
  return { route, navigate };
}

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream: #F5F0E8; --ink: #1A1612; --rust: #C4411C;
    --warm: #E8DDD0; --muted: #7A6F65; --card-bg: #FEFCF8;
    --shadow: 4px 4px 0px #1A1612; --shadow-lg: 6px 6px 0px #1A1612;
  }
  body { background: var(--cream); color: var(--ink); font-family: 'DM Sans', sans-serif; }
  @keyframes slideIn { from { transform: translateX(40px); opacity:0; } to { transform: translateX(0); opacity:1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  .card-hover { transition: transform .15s, box-shadow .15s; cursor: pointer; }
  .card-hover:hover { transform: translate(-2px,-2px); box-shadow: var(--shadow-lg) !important; }
  .btn-hover:hover:not(:disabled) { transform: translate(-1px,-1px); box-shadow: var(--shadow-lg) !important; }
  .nav-btn-hover:hover { background: #F5F0E8 !important; color: #1A1612 !important; }
  .fav-hover:hover { background: #1A1612 !important; color: #F5F0E8 !important; }
  .fade-up { animation: fadeUp .4s ease both; }
  .skeleton {
    background: linear-gradient(90deg, #E8DDD0 25%, #F5F0E8 50%, #E8DDD0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border: 2px solid #1A1612;
  }
  input, select, textarea {
    width: 100%; padding: 12px 14px;
    border: 2px solid #1A1612; background: #FEFCF8;
    font-family: 'DM Sans', sans-serif; font-size: 15px; color: #1A1612;
    outline: none; -webkit-appearance: none;
    transition: box-shadow .15s;
  }
  input:focus { box-shadow: var(--shadow); }
  .grid-bg {
    background-image:
      linear-gradient(rgba(196,65,28,.12) 1px, transparent 1px),
      linear-gradient(90deg, rgba(196,65,28,.12) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  @media (max-width: 768px) {
    .auth-grid { grid-template-columns: 1fr !important; }
    .auth-visual { display: none !important; }
    .detail-grid { grid-template-columns: 1fr !important; }
    .page-pad { padding: 24px 16px !important; }
    .nav-user { display: none !important; }
    .prop-grid { grid-template-columns: 1fr !important; }
  }
`;

const fmt = (n) => "$" + n.toLocaleString();

function Mono({ children, style, ...rest }) {
  return (
    <span style={{ fontFamily: "'DM Mono', monospace", ...style }} {...rest}>
      {children}
    </span>
  );
}
function Serif({ children, style, tag = "div", ...rest }) {
  const Tag = tag;
  return (
    <Tag
      style={{ fontFamily: "'Playfair Display', serif", ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function Navbar({ navigate }) {
  const { user, logout } = useAuth();
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#1A1612",
        borderBottom: "3px solid #1A1612",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 64,
      }}
    >
      <Serif
        style={{
          fontSize: 28,
          fontWeight: 900,
          color: "#F5F0E8",
          letterSpacing: -1,
          cursor: "pointer",
        }}
        onClick={() => navigate("home")}
      >
        Haus<span style={{ color: "#C4411C" }}>.</span>
      </Serif>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user ? (
          <>
            <Mono
              className="nav-user"
              style={{
                color: "#E8DDD0",
                marginRight: 12,
                fontSize: 12,
                letterSpacing: 0.5,
              }}
            >
              ↳ {user.name}
            </Mono>
            <NavBtn onClick={() => navigate("properties")}>Browse</NavBtn>
            <NavBtn onClick={() => navigate("dashboard")}>Dashboard</NavBtn>
            <NavBtn
              primary
              onClick={() => {
                logout();
                navigate("home");
              }}
            >
              Sign out
            </NavBtn>
          </>
        ) : (
          <>
            <NavBtn onClick={() => navigate("login")}>Sign in</NavBtn>
            <NavBtn primary onClick={() => navigate("register")}>
              Register
            </NavBtn>
          </>
        )}
      </div>
    </nav>
  );
}

function NavBtn({ children, primary, onClick }) {
  return (
    <button
      className="nav-btn-hover"
      onClick={onClick}
      style={{
        background: primary ? "#C4411C" : "transparent",
        border: `2px solid ${primary ? "#C4411C" : "#F5F0E8"}`,
        color: "#F5F0E8",
        padding: "6px 16px",
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        letterSpacing: 0.5,
        cursor: "pointer",
        textTransform: "uppercase",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function AuthVisual({ headline, sub }) {
  return (
    <div
      className="auth-visual"
      style={{
        background: "#1A1612",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 48,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grid-bg" style={{ position: "absolute", inset: 0 }} />
      <Serif
        style={{
          position: "relative",
          fontSize: "clamp(36px, 4vw, 60px)",
          fontWeight: 900,
          lineHeight: 1.05,
          color: "#F5F0E8",
        }}
        dangerouslySetInnerHTML={{ __html: headline }}
      />
      <Mono
        style={{
          position: "relative",
          fontSize: 13,
          color: "#7A6F65",
          marginTop: 16,
          letterSpacing: 0.3,
        }}
      >
        {sub}
      </Mono>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <Mono
        style={{
          display: "block",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "#7A6F65",
          marginBottom: 8,
        }}
      >
        {label}
      </Mono>
      {children}
      {error && (
        <Mono style={{ fontSize: 11, color: "#C4411C", marginTop: 5 }}>
          {error}
        </Mono>
      )}
    </div>
  );
}

function PrimaryBtn({ children, onClick, disabled, style }) {
  return (
    <button
      className="btn-hover"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: 14,
        background: "#1A1612",
        color: "#F5F0E8",
        border: "2px solid #1A1612",
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        letterSpacing: 1,
        textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "var(--shadow)",
        opacity: disabled ? 0.5 : 1,
        transition: "all .15s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function LoginPage({ navigate }) {
  const { login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Valid email required";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      login(form.email, form.password);
      toast("Welcome back!", "success");
      navigate("dashboard");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <AuthVisual
        headline="Your next<br /><em style='color:#C4411C'>home</em><br />awaits."
        sub="// Nepal's premier property portal"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          background: "#F5F0E8",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }} className="fade-up">
          <Serif style={{ fontSize: 36, fontWeight: 700, marginBottom: 6 }}>
            Sign in
          </Serif>
          <Mono
            style={{
              fontSize: 12,
              color: "#7A6F65",
              marginBottom: 32,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "block",
            }}
          >
            // Access your buyer portal
          </Mono>
          <FormField label="Email address" error={errors.email}>
            <input
              type="email"
              value={form.email}
              placeholder="you@example.com"
              style={{ borderColor: errors.email ? "#C4411C" : "#1A1612" }}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input
              type="password"
              value={form.password}
              placeholder="••••••••"
              style={{ borderColor: errors.password ? "#C4411C" : "#1A1612" }}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </FormField>
          <PrimaryBtn onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign in →"}
          </PrimaryBtn>
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: "#7A6F65",
            }}
          >
            Don't have an account?{" "}
            <a
              onClick={() => navigate("register")}
              style={{
                color: "#C4411C",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ navigate }) {
  const { register } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email.match(/^\S+@\S+\.\S+$/)) e.email = "Valid email required";
    if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      register(form.name, form.email, form.password);
      toast("Account created! Welcome.", "success");
      navigate("properties");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 64px)",
      }}
    >
      <AuthVisual
        headline="Find your<br />perfect<br /><em style='color:#C4411C'>address.</em>"
        sub="// Join thousands of buyers"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          background: "#F5F0E8",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }} className="fade-up">
          <Serif style={{ fontSize: 36, fontWeight: 700, marginBottom: 6 }}>
            Create account
          </Serif>
          <Mono
            style={{
              fontSize: 12,
              color: "#7A6F65",
              marginBottom: 32,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              display: "block",
            }}
          >
            // Free. No commitment.
          </Mono>
          <FormField label="Full name" error={errors.name}>
            <input
              type="text"
              value={form.name}
              placeholder="Jane Smith"
              style={{ borderColor: errors.name ? "#C4411C" : "#1A1612" }}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </FormField>
          <FormField label="Email address" error={errors.email}>
            <input
              type="email"
              value={form.email}
              placeholder="you@example.com"
              style={{ borderColor: errors.email ? "#C4411C" : "#1A1612" }}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </FormField>
          <FormField label="Password" error={errors.password}>
            <input
              type="password"
              value={form.password}
              placeholder="Min. 6 characters"
              style={{ borderColor: errors.password ? "#C4411C" : "#1A1612" }}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </FormField>
          <PrimaryBtn onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Create account →"}
          </PrimaryBtn>
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              color: "#7A6F65",
            }}
          >
            Already have an account?{" "}
            <a
              onClick={() => navigate("login")}
              style={{
                color: "#C4411C",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  onNavigate,
  isFaved,
  onToggleFav,
  favLoading,
}) {
  const { user } = useAuth();
  const toast = useToast();

  const handleFav = (e) => {
    e.stopPropagation();
    if (!user) {
      toast("Sign in to save favourites", "error");
      return;
    }
    onToggleFav(property._id, property.title);
  };

  return (
    <div
      className="card-hover"
      onClick={() => onNavigate(property._id)}
      style={{
        background: "#FEFCF8",
        border: "2px solid #1A1612",
        boxShadow: "var(--shadow)",
        overflow: "hidden",
      }}
    >
      <img
        src={property.imageUrl}
        alt={property.title}
        loading="lazy"
        style={{
          width: "100%",
          height: 200,
          objectFit: "cover",
          display: "block",
          borderBottom: "2px solid #1A1612",
        }}
      />
      <div style={{ padding: 18 }}>
        <Mono
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: 1.5,
            color: "#C4411C",
            marginBottom: 6,
            display: "block",
          }}
        >
          {property.type}
        </Mono>
        <Serif
          style={{
            fontSize: 20,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 6,
          }}
        >
          {property.title}
        </Serif>
        <Mono
          style={{
            fontSize: 11,
            color: "#7A6F65",
            marginBottom: 12,
            display: "block",
          }}
        >
          📍 {property.location.city}, {property.location.country}
        </Mono>
        <Serif style={{ fontSize: 22, fontWeight: 700 }}>
          {fmt(property.price)}
        </Serif>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 18px",
          borderTop: "2px solid #1A1612",
          background: "#E8DDD0",
        }}
      >
        <div style={{ display: "flex", gap: 16 }}>
          {property.bedrooms > 0 && (
            <Mono style={{ fontSize: 11, color: "#7A6F65" }}>
              <strong style={{ color: "#1A1612", fontSize: 13 }}>
                {property.bedrooms}
              </strong>{" "}
              bed
            </Mono>
          )}
          <Mono style={{ fontSize: 11, color: "#7A6F65" }}>
            <strong style={{ color: "#1A1612", fontSize: 13 }}>
              {property.bathrooms}
            </strong>{" "}
            bath
          </Mono>
          {property.area && (
            <Mono style={{ fontSize: 11, color: "#7A6F65" }}>
              <strong style={{ color: "#1A1612", fontSize: 13 }}>
                {property.area.toLocaleString()}
              </strong>{" "}
              sqft
            </Mono>
          )}
        </div>
        <button
          className="fav-hover"
          onClick={handleFav}
          disabled={favLoading}
          style={{
            background: isFaved ? "#C4411C" : "transparent",
            border: `2px solid ${isFaved ? "#C4411C" : "#1A1612"}`,
            color: isFaved ? "#fff" : "#1A1612",
            width: 36,
            height: 36,
            cursor: favLoading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            transition: "all .15s",
            flexShrink: 0,
            opacity: favLoading ? 0.4 : 1,
          }}
        >
          {isFaved ? "♥" : "♡"}
        </button>
      </div>
    </div>
  );
}

function PropertiesPage({ navigate }) {
  const { favs, toggleFav } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState({});

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const handleToggleFav = async (id, title) => {
    setFavLoading((f) => ({ ...f, [id]: true }));
    await new Promise((r) => setTimeout(r, 300));
    toggleFav(id);
    toast(
      favs[id] ? `"${title}" removed from favourites` : `"${title}" saved ♥`,
      favs[id] ? "info" : "success",
    );
    setFavLoading((f) => ({ ...f, [id]: false }));
  };

  return (
    <div
      className="page-pad"
      style={{ padding: "48px 40px", maxWidth: 1280, margin: "0 auto" }}
    >
      <div
        style={{
          marginBottom: 40,
          borderBottom: "3px solid #1A1612",
          paddingBottom: 24,
        }}
      >
        <Mono
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#C4411C",
            marginBottom: 8,
            display: "block",
          }}
        >
          // Browse listings
        </Mono>
        <Serif
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 900,
            lineHeight: 1.05,
          }}
        >
          Available Properties
        </Serif>
        {!loading && (
          <Mono
            style={{
              fontSize: 13,
              color: "#7A6F65",
              marginTop: 6,
              display: "block",
            }}
          >
            {MOCK_PROPERTIES.length} properties found
          </Mono>
        )}
      </div>
      {loading ? (
        <div
          className="prop-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton" style={{ height: 320 }} />
          ))}
        </div>
      ) : (
        <div
          className="prop-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {MOCK_PROPERTIES.map((p, i) => (
            <div
              key={p._id}
              className="fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <PropertyCard
                property={p}
                onNavigate={(id) => navigate("detail", id)}
                isFaved={!!favs[p._id]}
                onToggleFav={handleToggleFav}
                favLoading={favLoading[p._id]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PropertyDetailPage({ id, navigate }) {
  const { user, favs, toggleFav } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [favLoading, setFavLoading] = useState(false);

  const property = MOCK_PROPERTIES.find((p) => p._id === id);
  const isFaved = !!favs[id];

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [id]);

  const handleToggleFav = async () => {
    if (!user) {
      toast("Sign in to save favourites", "error");
      navigate("login");
      return;
    }
    setFavLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    toggleFav(id);
    toast(
      isFaved ? "Removed from favourites" : "Saved to favourites ♥",
      isFaved ? "info" : "success",
    );
    setFavLoading(false);
  };

  if (loading)
    return (
      <div
        className="page-pad"
        style={{ maxWidth: 1100, margin: "0 auto", padding: 40 }}
      >
        <div
          className="skeleton"
          style={{ height: 40, width: 120, marginBottom: 24 }}
        />
        <div className="skeleton" style={{ height: 420 }} />
      </div>
    );
  if (!property) return <div style={{ padding: 40 }}>Property not found.</div>;

  return (
    <div
      className="page-pad fade-up"
      style={{ maxWidth: 1100, margin: "0 auto", padding: 40 }}
    >
      <button
        onClick={() => navigate("properties")}
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: 1,
          color: "#7A6F65",
          cursor: "pointer",
          marginBottom: 24,
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          border: "none",
          background: "transparent",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#C4411C")}
        onMouseLeave={(e) => (e.target.style.color = "#7A6F65")}
      >
        ← Back to listings
      </button>

      <div
        className="detail-grid"
        style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 40 }}
      >
        <div>
          <img
            src={property.imageUrl}
            alt={property.title}
            style={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
              border: "2px solid #1A1612",
              boxShadow: "var(--shadow-lg)",
            }}
          />
          <div style={{ marginTop: 24 }}>
            <Mono
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 2,
                color: "#C4411C",
                display: "block",
              }}
            >
              // About this property
            </Mono>
            <p style={{ lineHeight: 1.8, marginTop: 8, color: "#7A6F65" }}>
              {property.description}
            </p>
          </div>
        </div>

        <div>
          <Mono
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 2,
              color: "#C4411C",
              marginBottom: 8,
              display: "block",
            }}
          >
            {property.type}
          </Mono>
          <Serif
            style={{
              fontSize: "clamp(28px, 3vw, 42px)",
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            {property.title}
          </Serif>
          <Mono
            style={{
              fontSize: 12,
              color: "#7A6F65",
              marginBottom: 20,
              display: "block",
            }}
          >
            📍 {property.location.address}, {property.location.city},{" "}
            {property.location.country}
          </Mono>
          <Serif
            style={{
              fontSize: 36,
              fontWeight: 700,
              borderTop: "3px solid #1A1612",
              borderBottom: "3px solid #1A1612",
              padding: "12px 0",
              marginBottom: 20,
            }}
          >
            {fmt(property.price)}
          </Serif>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {[
              property.bedrooms > 0 && {
                label: "Bedrooms",
                val: property.bedrooms,
              },
              { label: "Bathrooms", val: property.bathrooms },
              property.area && {
                label: "Area",
                val: `${property.area.toLocaleString()} sqft`,
              },
              {
                label: "Status",
                val: property.isAvailable ? "Available" : "Unavailable",
                rust: true,
              },
            ]
              .filter(Boolean)
              .map((s) => (
                <div
                  key={s.label}
                  style={{
                    border: "2px solid #1A1612",
                    padding: 12,
                    background: "#FEFCF8",
                  }}
                >
                  <Mono
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      color: "#7A6F65",
                      display: "block",
                    }}
                  >
                    {s.label}
                  </Mono>
                  <Serif
                    style={{
                      fontSize: s.rust ? 16 : 20,
                      fontWeight: 700,
                      marginTop: 2,
                      color: s.rust ? "#C4411C" : "#1A1612",
                    }}
                  >
                    {s.val}
                  </Serif>
                </div>
              ))}
          </div>

          <button
            className="btn-hover"
            onClick={handleToggleFav}
            disabled={favLoading}
            style={{
              width: "100%",
              padding: 14,
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: favLoading ? "not-allowed" : "pointer",
              border: "2px solid #1A1612",
              boxShadow: "var(--shadow)",
              transition: "all .15s",
              background: isFaved ? "#C4411C" : "#1A1612",
              borderColor: isFaved ? "#C4411C" : "#1A1612",
              color: "#F5F0E8",
              opacity: favLoading ? 0.4 : 1,
            }}
          >
            {favLoading
              ? "Saving..."
              : isFaved
                ? "♥ Saved to favourites"
                : "♡ Save to favourites"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ navigate }) {
  const { user, favs, toggleFav } = useAuth();
  const toast = useToast();
  const [favLoading, setFavLoading] = useState({});

  useEffect(() => {
    if (!user) navigate("login");
  }, [user]);
  if (!user) return null;

  const favProperties = MOCK_PROPERTIES.filter((p) => favs[p._id]);

  const removeFav = async (id, title) => {
    setFavLoading((f) => ({ ...f, [id]: true }));
    await new Promise((r) => setTimeout(r, 300));
    toggleFav(id);
    toast(`"${title}" removed`, "info");
    setFavLoading((f) => ({ ...f, [id]: false }));
  };

  return (
    <div
      className="page-pad fade-up"
      style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px" }}
    >
      <div
        style={{
          background: "#1A1612",
          color: "#F5F0E8",
          border: "2px solid #1A1612",
          boxShadow: "var(--shadow-lg)",
          padding: "32px 36px",
          marginBottom: 40,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="grid-bg"
          style={{
            position: "absolute",
            inset: 0,
            backgroundSize: "32px 32px",
          }}
        />
        <Mono
          style={{
            position: "relative",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 2,
            color: "#C4411C",
            marginBottom: 8,
            display: "block",
          }}
        >
          // Buyer portal
        </Mono>
        <Serif
          style={{
            position: "relative",
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            lineHeight: 1.1,
          }}
        >
          Welcome, {user.name}.
        </Serif>
        <Mono
          style={{
            position: "relative",
            fontSize: 13,
            color: "#E8DDD0",
            marginTop: 8,
            display: "block",
          }}
        >
          Logged in as{" "}
          <span
            style={{
              background: "#C4411C",
              color: "#fff",
              padding: "2px 8px",
              fontSize: 11,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {user.role}
          </span>{" "}
          · {user.email}
        </Mono>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 12,
          borderBottom: "3px solid #1A1612",
          paddingBottom: 12,
          marginBottom: 24,
        }}
      >
        <Serif style={{ fontSize: 28, fontWeight: 700 }}>My Favourites</Serif>
        <Mono style={{ fontSize: 13, color: "#C4411C" }}>
          ({favProperties.length})
        </Mono>
      </div>

      {favProperties.length === 0 ? (
        <div
          style={{
            border: "2px dashed #7A6F65",
            padding: 48,
            textAlign: "center",
            background: "#FEFCF8",
          }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>♡</div>
          <Serif style={{ fontSize: 22, marginBottom: 8 }}>
            No saved properties yet.
          </Serif>
          <Mono style={{ fontSize: 12, color: "#7A6F65", display: "block" }}>
            Browse listings and heart the ones you love.
          </Mono>
          <button
            className="btn-hover"
            onClick={() => navigate("properties")}
            style={{
              display: "inline-block",
              marginTop: 20,
              padding: "10px 20px",
              border: "2px solid #1A1612",
              background: "#1A1612",
              color: "#F5F0E8",
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
              cursor: "pointer",
              boxShadow: "var(--shadow)",
            }}
          >
            Browse properties →
          </button>
        </div>
      ) : (
        <div
          className="prop-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {favProperties.map((p, i) => (
            <div
              key={p._id}
              className="fade-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <PropertyCard
                property={p}
                onNavigate={(id) => navigate("detail", id)}
                isFaved={true}
                onToggleFav={(id, title) => removeFav(id, title)}
                favLoading={favLoading[p._id]}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HomePage({ navigate }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 64px)",
        background: "#F5F0E8",
        textAlign: "center",
        padding: "40px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(26,22,18,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(26,22,18,.06) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div style={{ position: "relative" }} className="fade-up">
        <Mono
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 3,
            color: "#C4411C",
            marginBottom: 16,
            display: "block",
          }}
        >
          // Nepal Real Estate
        </Mono>
        <Serif
          style={{
            fontSize: "clamp(48px,8vw,96px)",
            fontWeight: 900,
            lineHeight: 1.0,
            marginBottom: 24,
          }}
          dangerouslySetInnerHTML={{
            __html:
              "Find your<br /><em style='color:#C4411C;font-style:italic'>perfect</em><br />home.",
          }}
        />
        <Mono
          style={{
            fontSize: 14,
            color: "#7A6F65",
            maxWidth: 400,
            margin: "0 auto 36px",
            lineHeight: 1.8,
            display: "block",
          }}
        >
          Browse curated properties across Nepal. Save your favourites. Make it
          yours.
        </Mono>
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            className="btn-hover"
            onClick={() => navigate("properties")}
            style={{
              padding: "14px 32px",
              background: "#1A1612",
              color: "#F5F0E8",
              border: "2px solid #1A1612",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "var(--shadow)",
              transition: "all .15s",
            }}
          >
            Browse properties →
          </button>
          <button
            className="btn-hover"
            onClick={() => navigate("register")}
            style={{
              padding: "14px 32px",
              background: "transparent",
              color: "#1A1612",
              border: "2px solid #1A1612",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13,
              letterSpacing: 1,
              textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "var(--shadow)",
              transition: "all .15s",
            }}
          >
            Create account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const { route, navigate } = useRoute();

  return (
    <ToastProvider>
      <AuthProvider>
        <style>{STYLES}</style>
        <Navbar navigate={navigate} />
        {route.page === "home" && <HomePage navigate={navigate} />}
        {route.page === "login" && <LoginPage navigate={navigate} />}
        {route.page === "register" && <RegisterPage navigate={navigate} />}
        {route.page === "properties" && <PropertiesPage navigate={navigate} />}
        {route.page === "detail" && (
          <PropertyDetailPage id={route.param} navigate={navigate} />
        )}
        {route.page === "dashboard" && <DashboardPage navigate={navigate} />}
      </AuthProvider>
    </ToastProvider>
  );
}
