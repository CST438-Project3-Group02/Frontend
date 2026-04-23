import { Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?: "default" | "title" | "subtitle" | "link";
};

export function ThemedText({
  style,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const typeStyles = {
    default: "text-base text-text",
    title: "text-2xl font-bold text-text",
    subtitle: "text-lg font-semibold text-text",
    link: "text-primary underline",
  };

  return <Text style={style} className={typeStyles[type]} {...rest} />;
}
