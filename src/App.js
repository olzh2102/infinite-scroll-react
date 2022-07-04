import React, { useState, useRef, useCallback } from "react";
import useBookSearch from "./useBookSearch";

export default function App() {
    const [query, setQuery] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    const { hasMore, books, loading, error } = useBookSearch(
        query,
        pageNumber
    );

    const observer = useRef();
    const lastBookElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPageNumber((prev) => prev + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    function handleSearch(e) {
        setQuery(e.target.value);
        setPageNumber(1);
    }

    return (
        <>
            <input
                type="text"
                value={query}
                onChange={handleSearch}
            />

            {books.map((book, index) => {
                if (books.length == index + 1)
                    return (
                        <div ref={lastBookElementRef} key={book}>
                            {book}
                        </div>
                    );
                return <div key={book}>{book}</div>;
            })}

            <div>{loading && "loading..."}</div>
            <div>error</div>
        </>
    );
}
