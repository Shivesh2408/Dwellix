"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { forgotPassword, login, resetPassword, signup, verifyEmail, type AuthSession, AuthError } from "./auth-service";
import { setAccessToken } from "@/lib/api-client";
import { getPasswordStrength, passwordsMatch, validateEmail, validatePassword, validatePhoneNumber } from "./auth-validation";

type FieldErrorMap = Record<string, string>;

function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }

  return <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>;
}

function AuthInputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  autoComplete,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </span>
      <Input
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        error={Boolean(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={`${name}-error`}
      />
      <div id={`${name}-error`}>
        <FieldError error={error} />
      </div>
    </label>
  );
}

function PasswordStrengthMeter({ password }: { password: string }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  return (
    <div className="space-y-2 rounded-2xl border border-border/60 bg-secondary/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-foreground">Password strength</div>
          <div className="text-xs text-muted-foreground">{strength.hint}</div>
        </div>
        <Badge variant={strength.score >= 4 ? "success" : strength.score >= 3 ? "warning" : "destructive"}>
          {strength.label}
        </Badge>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className={cn(
              "h-2 flex-1 rounded-full bg-border/70 transition-colors",
              segment < strength.score && strength.score >= 4 && "bg-success/80",
              segment < strength.score && strength.score === 3 && "bg-warning/70",
              segment < strength.score && strength.score <= 2 && "bg-destructive/70"
            )}
          />
        ))}
      </div>
    </div>
  );
}

function SuccessPanel({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
  secondaryAction?: React.ReactNode;
}) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">{action}{secondaryAction}</div>
    </div>
  );
}

function GoogleButton({ label }: { label: string }) {
  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.NEXT_PUBLIC_AUTH_API_BASE_URL ?? "";
    window.location.href = `${apiBaseUrl}/oauth2/authorization/google`;
  };

  return (
    <Button
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      className="h-11 w-full gap-3 border-border/70 bg-background/80 cursor-pointer"
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M21.35 11.1h-9.18v2.98h5.26c-.23 1.31-.99 2.43-2.11 3.18v2.65h3.41c2-1.84 3.16-4.55 3.16-7.77 0-.73-.07-1.43-.19-2.04Z" fill="#4285F4" />
        <path d="M12.17 22c2.67 0 4.9-.88 6.53-2.4l-3.41-2.65c-.95.63-2.16 1-3.12 1-2.4 0-4.43-1.63-5.16-3.82H3.48v2.76A9.99 9.99 0 0 0 12.17 22Z" fill="#34A853" />
        <path d="M7.01 14.13a6 6 0 0 1 0-4.26V7.11H3.48a10 10 0 0 0 0 9.78l3.53-2.76Z" fill="#FBBC05" />
        <path d="M12.17 5.97c1.45 0 2.76.5 3.79 1.48l2.84-2.84A9.6 9.6 0 0 0 12.17 2C8.77 2 5.77 3.95 3.48 7.11l3.53 2.76c.73-2.19 2.76-3.9 5.16-3.9Z" fill="#EA4335" />
      </svg>
      <span>{label}</span>
    </Button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="h-px flex-1 bg-border/70" />
      <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">or</span>
      <div className="h-px flex-1 bg-border/70" />
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const validate = () => {
    const nextErrors: FieldErrorMap = {};
    const emailError = validateEmail(form.email);
    if (emailError) nextErrors.email = emailError;
    if (!form.password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        rememberMe: form.rememberMe
      });
      if (response.tokens?.accessToken) {
        setAccessToken(response.tokens.accessToken);
      }
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof AuthError ? error.message : "Unable to sign in right now.";
      setSubmitMessage(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5">
        <AuthInputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={(value) => setForm((previous) => ({ ...previous, email: value }))}
          error={errors.email}
          placeholder="name@company.com"
          autoComplete="email"
          required
        />
        <AuthInputField
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={(value) => setForm((previous) => ({ ...previous, password: value }))}
          error={errors.password}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        <div className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3">
          <label className="flex items-center gap-3 text-sm font-medium text-foreground">
            <Checkbox
              checked={form.rememberMe}
              onCheckedChange={(checked) => setForm((previous) => ({ ...previous, rememberMe: checked === true }))}
            />
            Remember me
          </label>
          <Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {submitMessage ? (
          <div className="rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3 text-sm text-muted-foreground" role="status">
            {submitMessage}
          </div>
        ) : null}

        <Button type="submit" className="h-11 w-full" loading={loading}>
          Login
        </Button>

        <Divider />

        <GoogleButton label="Continue with Google" />
      </div>
    </form>
  );
}

export function SignupForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const passwordStrength = useMemo(() => getPasswordStrength(form.password), [form.password]);

  const validate = () => {
    const nextErrors: FieldErrorMap = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    const emailError = validateEmail(form.email);
    if (emailError) nextErrors.email = emailError;
    const phoneError = validatePhoneNumber(form.phoneNumber);
    if (phoneError) nextErrors.phoneNumber = phoneError;
    const passwordError = validatePassword(form.password);
    if (passwordError) nextErrors.password = passwordError;
    const matchError = passwordsMatch(form.password, form.confirmPassword);
    if (matchError) nextErrors.confirmPassword = matchError;
    if (!form.termsAccepted) nextErrors.termsAccepted = "You must accept the terms and conditions.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phoneNumber: form.phoneNumber.replace(/[\s()-]/g, ""),
        password: form.password,
      });
      setSuccess(true);
    } catch (error) {
      const message = error instanceof AuthError ? error.message : "Unable to create the account right now.";
      setErrors((previous) => ({ ...previous, submit: message }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessPanel
        icon={<CheckCircle2 className="h-8 w-8 text-success" />}
        title="Account created successfully!"
        description="Your Dwellix account has been created. You can now return to the login screen and sign in to get started with your home management."
        action={
          <Button asChild className="h-11 px-6 bg-blue-600 text-white hover:bg-blue-700">
            <Link href="/auth/login">Continue to Login</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <AuthInputField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={(value) => setForm((previous) => ({ ...previous, fullName: value }))}
            error={errors.fullName}
            placeholder="Alex Morgan"
            autoComplete="name"
            required
          />
        </div>
        <AuthInputField
          label="Email"
          name="signupEmail"
          type="email"
          value={form.email}
          onChange={(value) => setForm((previous) => ({ ...previous, email: value }))}
          error={errors.email}
          placeholder="alex@company.com"
          autoComplete="email"
          required
        />
        <AuthInputField
          label="Phone Number"
          name="phoneNumber"
          type="tel"
          value={form.phoneNumber}
          onChange={(value) => setForm((previous) => ({ ...previous, phoneNumber: value }))}
          error={errors.phoneNumber}
          placeholder="+1 555 123 4567"
          autoComplete="tel"
          required
        />
        <div className="sm:col-span-2">
          <AuthInputField
            label="Password"
            name="signupPassword"
            type="password"
            value={form.password}
            onChange={(value) => setForm((previous) => ({ ...previous, password: value }))}
            error={errors.password}
            placeholder="Create a secure password"
            autoComplete="new-password"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <PasswordStrengthMeter password={form.password} />
        </div>
        <div className="sm:col-span-2">
          <AuthInputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(value) => setForm((previous) => ({ ...previous, confirmPassword: value }))}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4">
        <label className="flex items-start gap-3 text-sm text-foreground">
          <Checkbox
            checked={form.termsAccepted}
            onCheckedChange={(checked) => setForm((previous) => ({ ...previous, termsAccepted: checked === true }))}
            aria-invalid={Boolean(errors.termsAccepted)}
          />
          <span>
            I agree to the <Link href="/terms" className="font-medium text-primary hover:underline">Terms & Conditions</Link> and acknowledge the privacy policy.
            <span className="block">
              <FieldError error={errors.termsAccepted} />
            </span>
          </span>
        </label>
      </div>

      {errors.submit ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {errors.submit}
        </div>
      ) : null}

      <div className="space-y-3">
        <Button type="submit" className="h-11 w-full" loading={loading}>
          Create Account
        </Button>
        <GoogleButton label="Continue with Google" />
      </div>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    setError(emailError);
    if (emailError) return;

    setLoading(true);
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (requestError) {
      setError(requestError instanceof AuthError ? requestError.message : "Unable to send a reset link right now.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessPanel
        icon={<Mail className="h-8 w-8" />}
        title="Reset link sent."
        description="If an account exists for that email address, you will receive a password reset link shortly."
        action={
          <Button asChild className="h-11 px-6">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        }
      />
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <AuthInputField
        label="Email"
        name="forgotEmail"
        type="email"
        value={email}
        onChange={setEmail}
        error={error ?? undefined}
        placeholder="name@company.com"
        autoComplete="email"
        required
      />

      <Button type="submit" className="h-11 w-full" loading={loading}>
        Send Reset Link
      </Button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const nextErrors: FieldErrorMap = {};
    const passwordError = validatePassword(form.password);
    if (passwordError) nextErrors.password = passwordError;
    const matchError = passwordsMatch(form.password, form.confirmPassword);
    if (matchError) nextErrors.confirmPassword = matchError;
    if (!token) nextErrors.token = "Reset token is missing from the link.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess(true);
    } catch (requestError) {
      setErrors((previous) => ({
        ...previous,
        submit: requestError instanceof AuthError ? requestError.message : "Unable to reset your password right now.",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <SuccessPanel
        icon={<ShieldCheck className="h-8 w-8" />}
        title="Password updated."
        description="Your account password has been updated successfully. You can sign in again with the new password."
        action={
          <Button asChild className="h-11 px-6">
            <Link href="/auth/login">Return to login</Link>
          </Button>
        }
        secondaryAction={
          <Button variant="outline" className="h-11 px-6" onClick={() => router.push("/auth/login")}>Open login</Button>
        }
      />
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {errors.token ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {errors.token}
        </div>
      ) : null}
      <AuthInputField
        label="New Password"
        name="newPassword"
        type="password"
        value={form.password}
        onChange={(value) => setForm((previous) => ({ ...previous, password: value }))}
        error={errors.password}
        placeholder="Create a new password"
        autoComplete="new-password"
        required
      />
      <PasswordStrengthMeter password={form.password} />
      <AuthInputField
        label="Confirm Password"
        name="resetConfirmPassword"
        type="password"
        value={form.confirmPassword}
        onChange={(value) => setForm((previous) => ({ ...previous, confirmPassword: value }))}
        error={errors.confirmPassword}
        placeholder="Repeat the new password"
        autoComplete="new-password"
        required
      />

      {errors.submit ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
          {errors.submit}
        </div>
      ) : null}

      <Button type="submit" className="h-11 w-full" loading={loading}>
        Reset Password
      </Button>
    </form>
  );
}

export function VerifyEmailView({ token }: { token?: string }) {
  const [status, setStatus] = useState<"idle" | "verifying" | "verified" | "error">(token ? "verifying" : "idle");
  const [message, setMessage] = useState<string>(token ? "Verifying your email address..." : "Open the verification link from your inbox to complete your account.");

  const handleResend = async () => {
    setStatus("idle");
    setMessage("The resend architecture is ready. Wire it to the backend email service when available.");
  };

  useEffect(() => {
    if (!token || status !== "verifying") {
      return;
    }

    let cancelled = false;

    void verifyEmail({ token })
      .then(() => {
        if (cancelled) {
          return;
        }
        setStatus("verified");
        setMessage("Your email has been verified successfully.");
      })
      .catch((requestError) => {
        if (cancelled) {
          return;
        }
        setStatus("error");
        setMessage(requestError instanceof AuthError ? requestError.message : "Unable to verify the email right now.");
      });

    return () => {
      cancelled = true;
    };
  }, [status, token]);

  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary">
        <Sparkles className="h-9 w-9" />
      </div>
      <div className="space-y-2">
        <h3 className="text-2xl font-semibold tracking-tight">{status === "verified" ? "Email verified" : "Verify your email"}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{message}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" className="h-11 px-6" onClick={handleResend} loading={status === "verifying"}>
          Resend Verification Button
        </Button>
        <Button asChild className="h-11 px-6" disabled={status !== "verified"}>
          <Link href={status === "verified" ? "/dashboard" : "/auth/login"}>Continue</Link>
        </Button>
      </div>

      {status === "error" ? (
        <Card className="border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          The verification link could not be completed. Try again or request a new verification email.
        </Card>
      ) : null}
    </div>
  );
}
