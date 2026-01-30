import "./HomeFooter.css"
import "../Home.css"

export default function HomeFooter({grid_style}) {
    
    
    return (
        // iconecolor div10
        <div className={`${grid_style} homefooter-grid stretch`}>

                <div className="iconecolor homefooter1 ">
                    <a href="">
                        contact (notre github)
                    </a>
                </div>


                <div>
                    <p>8:42</p>
                </div>
                

                <div className="iconecolor homefooter3 ">
                    <a href="">
                        Profile
                    </a>
                </div>

        </div>
    );
}