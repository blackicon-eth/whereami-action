import classNames from "classnames";

type ButtonProps = {
  buttonText: string;
  textSize?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl";
  icon?: "none" | React.ReactElement;
  iconBgColor?: "violet" | "pink" | "red" | "orange" | "yellow" | "lime" | "cyan";
  color?: "violet" | "pink" | "red" | "orange" | "yellow" | "lime" | "cyan";
  rounded?: "none" | "md" | "lg" | "2xl" | "full";
  disabled?: boolean;
  className?: string;
  onClick?: (e: any) => void;
};

const Button = ({
  buttonText = "Button",
  textSize = "base",
  rounded = "none",
  icon = "none",
  iconBgColor = "pink",
  color = "cyan",
  disabled,
  className,
  onClick = () => {},
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        "flex justify-center items-center whitespace-nowrap gap-2 border-black border-2 h-10 px-4 shadow-[2px_2px_0px_rgba(0,0,0,1)]",
        { "active:shadow-none": !disabled },
        {
          "bg-violet-200 hover:bg-violet-300 active:bg-violet-400": color === "violet" && !disabled,
        },
        {
          "bg-pink-200 hover:bg-pink-300 active:bg-pink-400": color === "pink" && !disabled,
        },
        {
          "bg-red-400 hover:bg-red-500 active:bg-red-600": color === "red" && !disabled,
        },
        {
          "bg-orange-200 hover:bg-orange-300 active:bg-orange-400": color === "orange" && !disabled,
        },
        {
          "bg-yellow-200 hover:bg-yellow-300 active:bg-yellow-400": color === "yellow" && !disabled,
        },
        {
          "bg-lime-200 hover:bg-lime-300 active:bg-lime-400": color === "lime" && !disabled,
        },
        {
          "bg-cyan-200 hover:bg-cyan-300 active:bg-cyan-400": color === "cyan" && !disabled,
        },
        { "text-xs": textSize === "xs" },
        { "text-sm": textSize === "sm" },
        { "text-base": textSize === "base" },
        { "text-lg": textSize === "lg" },
        { "text-xl": textSize === "xl" },
        { "text-2xl": textSize === "2xl" },
        { "text-3xl": textSize === "3xl" },
        { "text-4xl": textSize === "4xl" },
        { "text-5xl": textSize === "5xl" },
        { "text-6xl": textSize === "6xl" },
        { "rounded-none": rounded === "none" },
        { "rounded-lg": rounded === "lg" },
        { "rounded-2xl": rounded === "2xl" },
        { "rounded-md": rounded === "md" },
        { "rounded-full": rounded === "full" },
        {
          "border-[#727272] bg-[#D4D4D4] text-[#676767]": disabled,
        },
        className
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonText ?? null}
      {icon !== "none" ? (
        <div
          className={classNames(
            "flex justify-center items-center p-1 rounded-full border-black border-2",
            {
              "bg-violet-300": iconBgColor === "violet",
            },
            { "bg-pink-300": iconBgColor === "pink" },
            { "bg-red-500": iconBgColor === "red" },
            { "bg-orange-300": iconBgColor === "orange" },
            { "bg-yellow-300": iconBgColor === "yellow" },
            { "bg-lime-300": iconBgColor === "lime" },
            { "bg-cyan-300": iconBgColor === "cyan" }
          )}
        >
          {icon}
        </div>
      ) : null}
    </button>
  );
};

export default Button;
