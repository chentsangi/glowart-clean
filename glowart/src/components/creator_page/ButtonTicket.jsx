import { ButtonWrapper } from './css/ButtonStyle.js';

const Button = () => {
    return (
            <ButtonWrapper>
                <div className="button">
                    <button className="btn cube cube-hover" type="button">
                        <div className="bg-top">
                            <div className="bg-inner" />
                        </div> 
                        <div className="bg-right">
                            <div className="bg-inner" />
                        </div>
                        <div className="bg">
                            <div className="bg-inner" />
                        </div>
                        <div className="text">買票去➤➤➤</div>
                    </button> 
                </div>
            </ButtonWrapper>
            
    );
}

export default Button;