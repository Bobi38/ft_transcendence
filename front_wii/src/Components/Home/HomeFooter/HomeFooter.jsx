import "./HomeFooter.css"
import "../Home.css"

export default function HomeFooter({grid_style, changePage}) {
    
    return (
        <div className={`${grid_style} homefooter-grid stretch`}>

                <button onClick={() => changePage('ContactUs')} 
                        className="homefooter1 iconecolor center">
                    <a href="">
                        contact (notre github)
                    </a>
                </button>


                <div className="homefooter2 center">
                    <p>8:42</p>
                </div>
                

                <button onClick={() => changePage('Profile')}
                        className="homefooter3 iconecolor center">
                    <a href="">
                        Profile
                    </a>
                </button>

        </div>
    );
}