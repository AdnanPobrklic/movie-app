import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useEffect,
    useRef,
} from "react";

const MovieContext = createContext<
    | {
          currentDisplay: any[];
          setCurrentDisplay: React.Dispatch<React.SetStateAction<any[]>>;
          showTV: boolean;
          setShowTV: React.Dispatch<React.SetStateAction<boolean>>;
          searchValue: string;
          setSearchValue: React.Dispatch<React.SetStateAction<string>>;
          debouncedSearchValue: string;
      }
    | undefined
>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentDisplay, setCurrentDisplay] = useState<any[]>([]);
    const [showTV, setShowTV] = useState<boolean>(true);
    const [searchValue, setSearchValue] = useState<string>("");
    const [debouncedSearchValue, setDebouncedSearchValue] = useState("");
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchValue(searchValue);
        }, 1000); // 1 second delay

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchValue]);

    return (
        <MovieContext.Provider
            value={{
                currentDisplay,
                setCurrentDisplay,
                showTV,
                setShowTV,
                searchValue,
                setSearchValue,
                debouncedSearchValue,
            }}
        >
            {children}
        </MovieContext.Provider>
    );
};

export const useMovies = () => {
    const context = useContext(MovieContext);
    if (!context) {
        throw new Error("useMovies must be used with a MovieProvider");
    }
    return context;
};
