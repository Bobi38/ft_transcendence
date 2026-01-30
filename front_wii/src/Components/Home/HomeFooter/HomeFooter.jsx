import "./HomeFooter.css"
import "../Home.css"

export default function HomeFooter({grid_style}) {
    
    return (
        <div className={`${grid_style} homefooter-grid stretch`}>

                <div className="homefooter1 iconecolor center">
                    <a href="">
                        contact (notre github)
                    </a>
                </div>


                <div className="homefooter2 center">
                    <p>8:42</p>
                </div>
                

                <div className="homefooter3 iconecolor center">
                    <a href="">
                        Profile
                    </a>
                </div>

        </div>
    );
}