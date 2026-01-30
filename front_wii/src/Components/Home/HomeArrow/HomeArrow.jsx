import "./HomeArrow.css";
import "../Home.css";
    
export default function HomeArrow({grid_style}) {
    return (
        <>
            <div className={`${grid_style}`}>
                <a  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    target="_blank">
                    
                    <div className="arrow-right"></div>
                </a>
            </div>
        </>
    )
}
