/* Css */
import styles from "./HomeArrow.module.scss"
import "../Home.scss";


export default function HomeArrow({grid_id}) {
    return (
        <>
            <div className={`${grid_id}`}>
                <a  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    target="_blank">

                    <div className={styles.HomeArrow_right}></div>
                </a>
            </div>
        </>
    )
}
