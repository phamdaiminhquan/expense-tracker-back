import { Paper, styled } from '@mui/material';
import { STYLE } from '@/common/constant';

export const PaperSelect = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: STYLE.BORDER_RADIUS_ELEMENT_WRAPPER,
  padding: STYLE.PADDING_GAP_ITEM,
  backgroundImage: 'none',
  boxShadow: theme.shadows[1],
  '& > .MuiAutocomplete-listbox': {
    padding: 0,
    '& > .MuiAutocomplete-option': {
      padding: STYLE.PADDING_GAP_ITEM,
      borderRadius: STYLE.BORDER_RADIUS_ELEMENT,
      transition: STYLE.TRANSITION_TIME,
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      "&[aria-selected='true']": {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      },
    },
  },
}));
