import { cn } from "@/lib/utils";

interface ContainerProps {
    children?: React.ReactNode;
    className?: string;
}

const Container: React.FC<ContainerProps> = ({
    children,
    className
}) => {
    return (
        <div className={cn("mx-auto max-w-7xl 2xl:max-w-[1920px]", className)}>
            {children}
        </div>
    );
}

export default Container;