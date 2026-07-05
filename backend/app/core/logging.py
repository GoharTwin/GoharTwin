"""Structured logging for GoharTwin backend."""

import logging
import sys

LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"


def get_logger(name: str, level: int = logging.INFO) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(logging.Formatter(LOG_FORMAT))
        logger.addHandler(handler)
        logger.setLevel(level)
        logger.propagate = False
    return logger


api_log = get_logger("gohartwin.api")
auth_log = get_logger("gohartwin.auth")
ai_log = get_logger("gohartwin.ai")
system_log = get_logger("gohartwin.system")
