import { useState } from 'react'
import { BrowserRouter as useLocation } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/three';
import RingChartObject from './TorusObject';
import Taskbar from './taskbar';


const RingChartGroup = ({
    title = 'Title',
    segmentData,
    position,
    radius,
    innerRadius,
    thickness,
    gap,
    inclinaison
}) => {
    const [isMinimized, setIsMinimized] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    const handleClose = (e) => {
        e.stopPropagation(); 
        setIsClosed(true)
    };
    const handleOpen = (e) => {
        e.stopPropagation(); 
        setIsClosed(false);
    }
    const handleMinimize = (e) => {
        e.stopPropagation(); 
        setIsMinimized(true)
    };
    const handleMaximize = (e) => {
        e.stopPropagation(); 
        setIsMinimized(false)
    };


    const [ringScale, setRingScale] = useState(1)

    const { ringSpring } = useSpring({
        ringSpring: isClosed ? 0 : (isMinimized ? 0.5 : 1), 
        config: { tension: 100, friction: 10 },
    });

    return (
        <group position={position}>
            <animated.group>
                <Taskbar
                    onClose={handleClose}
                    onMaximize={handleMaximize}
                    onMinimize={handleMinimize}
                    onOpen={handleOpen}
                    text={title}
                />
            </animated.group>

            <animated.group scale={ringSpring}  >
                <RingChartObject segmentData={segmentData} radius={radius} innerRadius={innerRadius} thickness={thickness} gap={gap} inclinaison={inclinaison}  />
            </animated.group>
        </group>
    );
};

export default RingChartGroup
