import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import CSS styles
import styles from './Error404.module.css';

/**
 * Error404 - A stylish 404 error page component with typewriter effect and countdown timer
 *
 * This component displays a terminal-style 404 error page with:
 * - Typewriter effect for error messages
 * - Countdown timer for automatic redirection
 * - "Go Back" button for manual navigation
 * - Random humorous error messages
 *
 * @returns React component
 */
export const Error404 = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);
    const [randomMessage, setRandomMessage] = useState('');
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    // Array of funny error messages - wrapped in useMemo to avoid recreating on every render
    const errorMessages = React.useMemo(
        () => [
            'The page has gone to get coffee. It might be back later.',
            'This page is on vacation. Try again when it returns.',
            'Error 404: Page not found. It probably went to a better website.',
            "The page you're looking for is in another castle.",
            'This page has been abducted by aliens.',
            'Page not found. Did you try turning it off and on again?',
        ],
        [],
    );

    // Create the full error message text as plain text
    const getFullErrorText = React.useCallback(() => {
        return `> ERROR CODE: "HTTP 404 Not Found"
> ERROR DESCRIPTION: "The Page You Are Looking For Could Not Be Found On This Server."
> ERROR POSSIBLY CAUSED BY: [mistyped URL, broken link, page moved to another dimension, nonexistent resource, invalid query string, expired session, incorrect bookmark, digital gremlins, an unknown error, someone spilled coffee on the code ... or just the university hates you...]
> RANDOM ERROR MESSAGE: "${randomMessage}"
> SUGGESTIONS TO GET BACK ON TRACK: [Check the URL for typos or return to the Home Page and use the Search Bar to find what you're looking for ...]
> SOME PAGES ON THIS SERVER THAT YOU DO HAVE PERMISSION TO ACCESS: [HOME, SIGN IN]
> HAVE A NICE DAY SIR AXELROD :-)`;
    }, [randomMessage]);

    // Effect for countdown timer to redirect to home page
    useEffect(() => {
        if (countdown > 0 && isTypingComplete) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            navigate('/');
        }
    }, [countdown, navigate, isTypingComplete]);

    // Effect to select a random error message on component mount
    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * errorMessages.length);
        setRandomMessage(errorMessages[randomIndex]);

        // Log the 404 error to console (could be replaced with actual error tracking)
        console.log('404 Error encountered at:', window.location.pathname);
    }, [errorMessages]);

    // Removed blinking effect for 404 heading

    // Effect for cursor blinking
    useEffect(() => {
        const cursorInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 400);

        return () => clearInterval(cursorInterval);
    }, []);

    // Typewriter effect implementation
    useEffect(() => {
        if (randomMessage) {
            const fullText = getFullErrorText();
            let i = 0;
            const typewriterSpeed = 40; // Slowed down to be twice slower

            // Start the typewriter effect
            const typewriterInterval = setInterval(() => {
                if (i <= fullText.length) {
                    setTypedText(fullText.substring(0, i));
                    i++;
                } else {
                    clearInterval(typewriterInterval);
                    setIsTypingComplete(true);
                }
            }, typewriterSpeed);

            return () => clearInterval(typewriterInterval);
        }
    }, [randomMessage, getFullErrorText]);

    // Function to handle manual navigation
    const handleGoHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate('/');
    };

    // Helper function to format section headers
    const formatSectionHeader = (line: string): string => {
        const formattedLine = line;

        // Map of section headers to their formatted versions
        const headerMap: Record<string, string> = {
            '> ERROR CODE': 'ERROR CODE',
            '> ERROR DESCRIPTION': 'ERROR DESCRIPTION',
            '> ERROR POSSIBLY CAUSED BY': 'ERROR POSSIBLY CAUSED BY',
            '> RANDOM ERROR MESSAGE': 'RANDOM ERROR MESSAGE',
            '> SUGGESTIONS TO GET BACK ON TRACK': 'SUGGESTIONS TO GET BACK ON TRACK',
            '> SOME PAGES ON THIS SERVER': 'SOME PAGES ON THIS SERVER THAT YOU DO HAVE PERMISSION TO ACCESS',
            '> HAVE A NICE DAY': 'HAVE A NICE DAY SIR AXELROD :-)',
        };

        // Find the matching header and apply formatting
        for (const [prefix, text] of Object.entries(headerMap)) {
            if (line.startsWith(prefix)) {
                return formattedLine.replace(text, `<span class="highlight">${text}</span>`);
            }
        }

        return formattedLine;
    };

    // Helper function to format brackets content
    const formatBracketContent = (line: string): string => {
        if (!line.includes('[') || !line.includes(']')) return line;
        if (line.indexOf('[') >= line.indexOf(']')) return line;

        const beforeBracket = line.substring(0, line.indexOf('[') + 1);
        const bracketContent = line.substring(line.indexOf('[') + 1, line.indexOf(']'));
        const afterBracket = line.substring(line.indexOf(']'));

        return beforeBracket + '<b>' + bracketContent + '</b>' + afterBracket;
    };

    // Helper function to generate a stable key for a line
    const generateLineKey = (line: string): string => {
        return `line-${line.startsWith('> ') ? line.substring(2, 12) : line.substring(0, 10)}`.replace(
            /[^a-zA-Z0-9]/g,
            '-',
        );
    };

    // Function to convert plain text with newlines to JSX with proper formatting
    const formatTypedText = () => {
        if (!typedText) return null;

        return typedText.split('\n').map((line, index, array) => {
            // Add cursor to the last line that's being typed
            const isLastLine = index === array.length - 1;
            const cursor = isLastLine && showCursor ? <span className={styles.cursor}>|</span> : null;

            // For each character in the line, we need to determine if it should be formatted
            // This ensures the typewriter effect works on all content including formatted text

            // For the HOME/SIGN IN line, we'll handle it specially when it's complete
            if (line.includes('HOME') && line.includes('SIGN IN') && line.includes(']')) {
                if (line.endsWith(']')) {
                    const beforeLinks = line.substring(0, line.indexOf('[') + 1);
                    return (
                        <p key="home-sign-in-line">
                            {beforeLinks}
                            <a href="/" onClick={handleGoHome}>
                                HOME
                            </a>
                            ,<a href="/login">SIGN IN</a>]{cursor}
                        </p>
                    );
                }
            }

            // For all other lines, we'll use a character-by-character approach
            // We'll create a formatted version of the line by adding HTML tags
            let formattedLine = formatSectionHeader(line);

            // Add italics to quoted text
            if (formattedLine.includes('"')) {
                formattedLine = formattedLine.replace(/"([^"]+)"/g, '"<i>$1</i>"');
            }

            // Add bold to list items in square brackets
            formattedLine = formatBracketContent(formattedLine);

            // Return the formatted line with the cursor
            return (
                <p key={generateLineKey(line)} className={styles.terminalLine}>
                    <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
                    {cursor}
                </p>
            );
        });
    };

    return (
        <div className={styles.errorPage}>
            <h1 className={styles.heading}>404</h1>
            <div className={styles.errorMessage}>
                <div className={styles.typewriterContainer}>{formatTypedText()}</div>

                {isTypingComplete && (
                    <>
                        <p className={styles.countdown}>Redirecting to home page in {countdown} seconds...</p>
                        <button onClick={() => navigate(-1)} className={styles.backButton}>
                            Go Back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
