export default function Background (){
    return(
        <div className="background">
            <div className="hdigits">
                <HDigits />
                <HDigits />
                <HDigits />
                <HDigits />
            </div>
            <div className="vdigits">
                <VDigits />
                <VDigits />
                <VDigits />
                <VDigits />
            </div>
            <div className="glow"></div>
        </div>
    )
}

function HDigits(){
    return (
        <>
            <span>0</span>
            <span>10</span>
            <span>20</span>
            <span>30</span>
            <span>40</span>
            <span>50</span>
            <span>60</span>
            <span>70</span>
            <span>80</span>
            <span>90</span>
            <span>00</span>
        </>
    )
}
function VDigits(){
    return (
        <>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span>9</span>
            <span>0</span>
        </>
    )
}