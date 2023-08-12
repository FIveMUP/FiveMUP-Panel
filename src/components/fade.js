import { forwardRef, cloneElement } from 'react';
import { useSpring, animated } from '@react-spring/web';
import PropTypes from 'prop-types';

export const Fade = forwardRef(function Fade(props, ref) {
    const {
      children,
      in: open,
      onClick,
      onEnter,
      onExited,
      ownerState,
      ...other
    } = props;
    const style = useSpring({
      from: { opacity: 0 },
      to: { opacity: open ? 1 : 0 },
      onStart: () => {
        if (open && onEnter) {
          onEnter(null, true);
        }
      },
      onRest: () => {
        if (!open && onExited) {
          onExited(null, true);
        }
      },
    });
  
    return (
      <animated.div 
        ref={ref} 
        style={style} 
        {...other}>
        {cloneElement(children, { onClick })}
      </animated.div>
    );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};