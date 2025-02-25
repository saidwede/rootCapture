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
        setRingScale(0);
    };
    const handleOpen = () => {
        setIsClosed(false);
    }




    const [isRingVisible, setIsRingVisible] = useState(true);
    const [taskbarScale, setTaskbarScale] = useState(1);
    const [ringScale, setRingScale] = useState(1)

    const { taskbarSpring } = useSpring({
        taskbarSpring: taskbarScale,
        config: { mass: 1, tension: 280, friction: 60 }
    });

    const { ringSpring } = useSpring({
        ringSpring: ringScale, // Toggle between 1 and 2 on click
        config: { tension: 100, friction: 10 },
    });

    const handleMinimize = () => {
        alert('Minimize')
        setIsRingVisible(true);
        setTaskbarScale(1.2);
        // if (!isRingVisible) {
        //     // If ring is hidden, show it at normal scale
        //     setIsRingVisible(true);
        //     setTaskbarScale(1);
        // } else {
        //     // Minimize both ring and taskbar
        //     setTaskbarScale(1);
        // }
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

    

    return (
        <group position={position}>
            <animated.group scale={taskbarSpring}>
                <Taskbar
                    onClose={handleClose}
                    onMaximize={() => handleMaximize()}
                    onMinimize={handleMinimize}
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
