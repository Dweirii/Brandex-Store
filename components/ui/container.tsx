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
        <div className={cn("mx-auto max-w-[1320px]", className)}>
            {children}
        </div>
    );
}

export default Container;