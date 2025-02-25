import { useState } from 'react'
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
    const [isMinimized, setIsMinimized] = useState(true);
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
        if(isClosed){
            setIsClosed(false);
        } 
        setIsMinimized(true)
    };
    const handleMaximize = (e) => {
        e.stopPropagation();
        if(isClosed){
            setIsClosed(false);
        } 
        setIsMinimized(false)
    };

    const { ringSpring } = useSpring({
        ringSpring: isClosed ? 0 : (isMinimized ? 1 : 1.5), 
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
