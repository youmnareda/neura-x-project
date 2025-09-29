import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import '../../assets/styles/Timeline.css';

import uploadIcon from '../../assets/images/upload.svg';
import brainIcon from '../../assets/images/ai-analysis.svg';
import reportIcon from '../../assets/images/report.svg';


const Timeline = () => {
    return (
        <div className='timeline-main'>
            <h1 className='timeline-heading'>How It Works</h1>
            <VerticalTimeline animate={true} lineColor="#DCDCFE">
                {/* Upload Card */}
                <VerticalTimelineElement
                    className="timeline-card"
                    position="right"
                    contentStyle={{ 
                        background: '#F4F5F9',
                        color: '#333',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        padding: '20px'
                    }}
                    contentArrowStyle={{ borderRight: '25px solid #F4F5F9' }}
                    iconStyle={{ 
                        background: '#5D66EA',
                        color: '#fff',
                        boxShadow: '0 0 0 4px #DCDCFE, inset 0 2px 0 rgba(0,0,0,0.08), 0 3px 0 4px rgba(0,0,0,0.05)',
                        width: '20px',
                        height: '20px',
                        margin: '10px 0 0 -10px'
                    }}
                >
                    <div className="timeline-box-header">
                        <img src={uploadIcon} alt="Upload icon" className="timeline-icon" />
                        <h2 className='timeline-title'>Upload Your Medical Image</h2>
                    </div>
                    <p className='timeline-description'>
                        Easily upload an X-ray or CT scan image using our secure platform. 
                        Our system supports multiple image formats for convenience.
                    </p>
                </VerticalTimelineElement>

                {/* AI-analysis Card */}
                <VerticalTimelineElement
                    className="timeline-card"
                    position="left"
                    contentStyle={{ 
                        background: '#F4F5F9',
                        color: '#333',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        padding: '20px'
                    }}
                    contentArrowStyle={{ borderRight: '25px solid #F4F5F9' }}
                    iconStyle={{ 
                        background: '#5D66EA',
                        color: '#fff',
                        boxShadow: '0 0 0 4px #DCDCFE, inset 0 2px 0 rgba(0,0,0,0.08), 0 3px 0 4px rgba(0,0,0,0.05)',
                        width: '20px',
                        height: '20px',
                        margin: '10px 0 0 -10px'
                    }}
                >
                    <div className="timeline-box-header">
                        <img src={brainIcon} alt="AI analysis icon" className="timeline-icon" />
                        <h2 className='timeline-title'>AI-Powered Analysis Begins</h2>
                    </div>
                    <p className='timeline-description'>
                        Once uploaded, our advanced AI model processes the image, detecting abnormalities such as 
                        brain cancer, tumors, and aneurysms with high precision.
                    </p>
                </VerticalTimelineElement>

                {/* Report Card */}
                <VerticalTimelineElement
                    className="timeline-card"
                    position="right"
                    contentStyle={{ 
                        background: '#F4F5F9',
                        color: '#333',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '10px',
                        padding: '20px'
                    }}
                    contentArrowStyle={{ borderRight: '25px solid #F4F5F9' }}
                    iconStyle={{ 
                        background: '#5D66EA',
                        color: '#fff',
                        boxShadow: '0 0 0 4px #DCDCFE, inset 0 2px 0 rgba(0,0,0,0.08), 0 3px 0 4px rgba(0,0,0,0.05)',
                        width: '20px',
                        height: '20px',
                        margin: '10px 0 0 -10px'
                    }}
                >
                    <div className="timeline-box-header">
                        <img src={reportIcon} alt="Results icon" className="timeline-icon" />
                        <h2 className='timeline-title'>Receive Instant Results</h2>
                    </div>
                    <p className='timeline-description'>
                        Within seconds, you'll receive a detailed analysis report highlighting any potential issues.
                        The results are presented in an easy-to-understand format for both medical professionals and patients.
                    </p>
                </VerticalTimelineElement>
            </VerticalTimeline>
        </div>
    );
};

export default Timeline;