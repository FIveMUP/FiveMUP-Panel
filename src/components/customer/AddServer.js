import { Backdrop, Button, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useSpring, animated } from '@react-spring/web';
import PropTypes from 'prop-types';
import { cloneElement, forwardRef, useState } from "react";

const Fade = forwardRef(function Fade(props, ref) {
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
      <animated.div ref={ref} style={style} {...other}>
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
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    backdropFilter: 'blur(4px)',
    border: '2px solid #000',
    boxShadow: 10,
    p: 4,
  };
  
export const AddServerModal = ({ isOpen, handleClose, children }) => {
    return (
      <div>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={isOpen}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={isOpen}>
            <Box sx={style}>
                {children}
            </Box>
          </Fade>
        </Modal>
      </div>
    );
  }
  