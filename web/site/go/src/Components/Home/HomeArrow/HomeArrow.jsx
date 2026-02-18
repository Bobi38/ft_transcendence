/* Css */
import styles from "./HomeArrow.module.scss"
import "../Home.scss";


export default function HomeArrow({grid_style}) {
    return (
        <>
            <div className={`${grid_style}`}>
                <a  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank">

                    <div className={styles.arrowRight}></div>
                </a>
            </div>
        </>
    )
}
