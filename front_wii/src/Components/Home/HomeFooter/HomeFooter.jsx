import "./HomeFooter.css"
import "../Home.css"

export default function HomeFooter() {
    
    
    return (
        <div className="grid_footer grid_fr1_fr2_fr1">

                <div className="grid_icone iconecolor" style={{gridColumnStart: 1,gridColumnEnd: 2}}>
                    <a href="">
                        contact (notre github)
                    </a>
                </div>


                <div>
                    <p>8:42</p>
                </div>
                

                <div className="grid_icone iconecolor" style={{gridColumnStart: 3,gridColumnEnd: 4}}>
                    <a href="">
                        Profile
                    </a>
                </div>

        </div>
    );
}