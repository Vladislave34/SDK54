// components/ui/Button.tsx
import { Pressable, Text } from "react-native";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    fullWidth?: boolean;
}

const variantStyles: Record<Variant, { container: string; text: string }> = {
    primary: {
        container: "bg-blue-600 active:bg-blue-700",
        text: "text-white font-semibold",
    },
    secondary: {
        container: "bg-zinc-800 active:bg-zinc-700",
        text: "text-white font-semibold",
    },
    outline: {
        container: "border border-blue-600 active:bg-blue-50",
        text: "text-blue-600 font-semibold",
    },
    ghost: {
        container: "active:bg-zinc-100",
        text: "text-zinc-700 font-medium",
    },
    danger: {
        container: "bg-red-500 active:bg-red-600",
        text: "text-white font-semibold",
    },
};

const sizeStyles: Record<Size, { container: string; text: string }> = {
    sm: { container: "px-3 py-1.5 rounded-md", text: "text-sm" },
    md: { container: "px-5 py-2.5 rounded-xl", text: "text-base" },
    lg: { container: "px-6 py-3.5 rounded-2xl", text: "text-lg" },
};

export function Button({
                           label,
                           onPress,
                           variant = "primary",
                           size = "md",
                           disabled = false,
                           fullWidth = false,
                       }: ButtonProps) {
    const v = variantStyles[variant];
    const s = sizeStyles[size];

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            className={`
        items-center justify-center
        ${v.container}
        ${s.container}
        ${fullWidth ? "w-full" : "self-start"}
        ${disabled ? "opacity-40" : ""}
      `}
        >
            <Text className={`${v.text} ${s.text}`}>{label}</Text>
        </Pressable>
    );
}