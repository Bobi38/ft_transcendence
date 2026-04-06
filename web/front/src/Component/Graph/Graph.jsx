/* extern */

/* back */

/* Css */
import "./Graph.scss";

/* Components */


export default function Graph({ v1, v2, v3, v4 }) {
    const total = v1 + v2 + v3 + v4;

    const p1 = (v1 / total) * 100;
    const p2 = (v2 / total) * 100;
    const p3 = (v3 / total) * 100;
    const p4 = (v4 / total) * 100;

    const stop1 = p1;
    const stop2 = stop1 + p2;
    const stop3 = stop2 + p3;

    const mid1 = (p1 / 2) * 3.6;
    const mid2 = (stop1 + p2 / 2) * 3.6;
    const mid3 = (stop2 + p3 / 2) * 3.6;
    const mid4 = (stop3 + p4 / 2) * 3.6;

	if (total == 0)
	{
		return (
			<div className="Graph-root Graph-empty"><span>Go play games its empty here</span></div>
		);
	}

    return (
        <div className="Graph-root" style={{
            "--stop1": `${stop1}%`,
            "--stop2": `${stop2}%`,
            "--stop3": `${stop3}%`,
            "--angle1": `${mid1}deg`,
            "--angle2": `${mid2}deg`,
            "--angle3": `${mid3}deg`,
            "--angle4": `${mid4}deg`,
        }}>
            <span className="label v1" style={{ "--a": "var(--angle1)" }}>{v1}</span>
            <span className="label v2" style={{ "--a": "var(--angle2)" }}>{v2}</span>
            <span className="label v3" style={{ "--a": "var(--angle3)" }}>{v3}</span>
            <span className="label v4" style={{ "--a": "var(--angle4)" }}>{v4}</span>
        </div>
    );
}