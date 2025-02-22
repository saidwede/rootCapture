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
    thickness,
    gap
}) => {
    const [isRingVisible, setIsRingVisible] = useState(true);
    const [taskbarScale, setTaskbarScale] = useState(1);
    
    // Animation spring
    const { ringScale } = useSpring({
        ringScale: isRingVisible ? taskbarScale : 0,
        config: { mass: 1, tension: 280, friction: 60 }
    });

    const { taskbarSpring } = useSpring({
        taskbarSpring: taskbarScale,
        config: { mass: 1, tension: 280, friction: 60 }
    });



    const handleMinimize = () => {
        if (!isRingVisible) {
            // If ring is hidden, show it at normal scale
            setIsRingVisible(true);
            setTaskbarScale(1);
        } else {
            // Minimize both ring and taskbar
            setTaskbarScale(1);
        }
    };

    const handleMaximize = () => {
        if (!isRingVisible) {
            // If ring is hidden, show it at normal scale
            setIsRingVisible(true);
            setTaskbarScale(1);
        } else {

            // Maximize both ring and taskbar
            setTaskbarScale(1.5);
        }
    };

    const handleClose = () => {
        // Hide only the ring, keep taskbar visible
        setIsRingVisible(false);
        // Reset taskbar to normal scale
        setTaskbarScale(1);
    };

    return (
        <group position={position}>
            <animated.group scale={taskbarSpring}>
                <Taskbar
                    onClose={() => handleClose()}
                    onMaximize={() => handleMaximize()}
                    onMinimize={handleMinimize}
                    text={title}
                />
            </animated.group>

            <animated.group scale={ringScale}>
                <RingChartObject segmentData={segmentData} radius={radius} thickness={thickness} gap={gap}  />
            </animated.group>
        </group>
    );
};

export default RingChartGroup
