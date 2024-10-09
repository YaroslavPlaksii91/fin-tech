import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react';
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import { NavLink, useParams, useMatch } from 'react-router-dom';

import {
  Label,
  Resizer,
  SidebarToggle,
  StyledAccordion,
  StyledAccordionDetails,
  StyledList,
  StyledListItemButton,
  StyledMainAccordionSummary,
  StyledNavLink,
  StyledPaper,
  StyledSubAccordionSummary,
  StyledWrapper
} from './styled';
import {
  DEFAULT_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  animationStyles,
  pages,
  reportPages
} from './config';

import AngleLeftSquareIcon from '@icons/angleLeftSquare.svg';
import { ExpandMoreIcon } from '@components/shared/Icons';
import {
  fetchDraftFlowList,
  fetchProductionFlowItem
} from '@store/flowList/asyncThunk';
import Logger from '@utils/logger';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { getProductionFlow, getFlow } from '@store/flow/asyncThunk';
import { selectFlowList } from '@store/flowList/selectors';
import { setInitialFlow } from '@store/flow/flow';
import { selectFlow } from '@store/flow/selectors';
import ActionsMenu from '@components/FlowManagment/ActionsMenu/ActionMenu';
import routes from '@constants/routes';
import { PRODUCTION_FLOW_ID } from '@constants/common';
import { useLoading } from '@contexts/LoadingContext';
import { AddFlow } from '@components/FlowManagment/AddFlow/AddFlowForm';
import StepList from '@components/StepManagment/StepList/StepList';
import { useActiveStep } from '@contexts/StepContext';
import { palette, theme } from '@theme';
import { hasPermission } from '@utils/helpers';
import { selectUserInfo } from '@store/auth/auth';
import { useThrottle } from '@hooks/useThrottle';
import { CROSS_PLATFORM_DRAWER_WIDTH } from '@constants/themeConstants';
import FlowListIcon from '@icons/flow-list.svg';
import FlowIcon from '@icons/flow.svg';
import ReportsIcon from '@icons/reports.svg';

const Sidebar = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { resetActive } = useActiveStep();
  const { startLoading, stopLoading } = useLoading();
  const { flowList, flowProduction } = useAppSelector(selectFlowList);
  const { flow } = useAppSelector(selectFlow);
  const user = useAppSelector(selectUserInfo);
  const match = useMatch(routes.underwriting.flow.dataDictionary(id!));

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  const [expanded, setExpanded] = useState(true);
  const [expandedFlow, setExpandedFlow] = useState<string | false>(false);
  const [expandedFlowList, setExpandedFlowList] = useState<boolean>(true);
  const [expandedReports, setExpandedReports] = useState(false);

  const [reportMenuAnchorEl, setReportMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const throttle = useThrottle();

  const hasVisibleReports = reportPages.some((item) =>
    hasPermission(user?.policies, item.permission)
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setReportMenuAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setReportMenuAnchorEl(null);
  };

  const handleReportsToggle = () => setExpandedReports((prev) => !prev);

  const handleExpandIconClick = (
    e: React.MouseEvent<SVGSVGElement>,
    flowItemId: string
  ) => {
    if (flowItemId === id) {
      e.preventDefault();
    }
  };

  const handleMouseDown = () => {
    setIsResizing(true);
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('mousemove', handleMouseMove, true);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('mousemove', handleMouseMove, true);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const newWidth = e.clientX - document.body.offsetLeft;
    if (newWidth > DEFAULT_SIDEBAR_WIDTH) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleChangeFlow =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpandedFlow(newExpanded ? panel : false);
    };

  const handleScroll = () => {
    if (scrollableRef.current && scrollableRef.current.scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  const throttleHandleScroll = () => throttle(handleScroll, 2000);

  useEffect(() => {
    const scrollableElement = scrollableRef.current;

    if (scrollableElement) {
      scrollableElement.addEventListener('scroll', throttleHandleScroll);

      return () => {
        scrollableElement.removeEventListener('scroll', throttleHandleScroll);
      };
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setExpanded(!expanded);
    const width = expanded ? MIN_SIDEBAR_WIDTH : DEFAULT_SIDEBAR_WIDTH;
    setSidebarWidth(width);
  }, [expanded]);

  const defaultFlowListLink = useMemo(() => {
    const flowListLink = routes.underwriting.flow.list;
    if (flowList.length) {
      return flowListLink(flowList[0].id);
    }

    if (flowProduction?.id) {
      return flowListLink(flowProduction.id);
    }
    return flowListLink();
  }, [flowList, flowProduction]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading();
        await Promise.allSettled([
          dispatch(fetchDraftFlowList()),
          dispatch(fetchProductionFlowItem())
        ]);
      } catch (error) {
        Logger.error('Error fetching data:', error);
      } finally {
        stopLoading();
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    const fetchFlow = async (flowId: string) => {
      try {
        startLoading();
        if (id === PRODUCTION_FLOW_ID) {
          await dispatch(getProductionFlow());
        } else {
          await dispatch(getFlow(flowId));
        }
      } catch (error) {
        Logger.error('Error fetching initial data:', error);
      } finally {
        stopLoading();
      }
    };

    resetActive();
    if (id) {
      void fetchFlow(id);
    } else {
      dispatch(setInitialFlow());
    }
  }, [id]);

  return (
    <StyledPaper
      elevation={0}
      ref={sidebarRef}
      style={{
        marginLeft: CROSS_PLATFORM_DRAWER_WIDTH,
        width: sidebarWidth,
        transition: !isResizing ? 'all 0.2s' : ''
      }}
    >
      {expanded && <Resizer onMouseDown={handleMouseDown} />}
      <SidebarToggle
        fullWidth
        onClick={toggleSidebar}
        expanded={expanded ? 1 : 0}
        startIcon={
          <AngleLeftSquareIcon
            color={theme.palette.common.black}
            width={18}
            height={18}
          />
        }
      >
        {expanded && (
          <Typography
            fontSize="13px"
            fontWeight="500"
            variant="body2"
            color={theme.palette.text.secondary}
            sx={animationStyles(expanded)}
          >
            Collapse Sidebar
          </Typography>
        )}
      </SidebarToggle>
      <Divider
        sx={(theme) => ({
          borderColor: isScrolled
            ? theme.palette.grayBorder
            : theme.palette.sidebarBackground,
          width: '100%',
          transition: '0.2s'
        })}
      />
      <StyledWrapper ref={scrollableRef} component="nav">
        <StyledList>
          {expanded ? (
            <StyledAccordion
              expanded={expandedFlowList}
              onChange={() => setExpandedFlowList(!expandedFlowList)}
              slotProps={{ transition: { unmountOnExit: true } }}
            >
              <StyledMainAccordionSummary
                expandIcon={<ExpandMoreIcon color="primary" />}
                aria-controls="flowList-content"
                id="flowList-header"
                expanded={expanded ? 1 : 0}
              >
                <NavLink
                  onClick={(e) => e.stopPropagation()}
                  to={defaultFlowListLink}
                >
                  <ListItemIcon>
                    <FlowListIcon />
                  </ListItemIcon>
                </NavLink>
                <Typography sx={animationStyles(expanded)}>
                  Flow List
                </Typography>
              </StyledMainAccordionSummary>
              <StyledAccordionDetails>
                <Label variant="body2">Flow on Production</Label>
                {flowProduction && (
                  <StyledAccordion
                    expanded={
                      expandedFlow === PRODUCTION_FLOW_ID && expandedFlow === id
                    }
                    onChange={handleChangeFlow(PRODUCTION_FLOW_ID)}
                    slotProps={{ transition: { unmountOnExit: true } }}
                  >
                    <Box
                      sx={{
                        position: 'relative'
                      }}
                    >
                      <StyledNavLink
                        to={`${routes.underwriting.flow.list(PRODUCTION_FLOW_ID)}`}
                      >
                        <StyledSubAccordionSummary
                          expandIcon={<ExpandMoreIcon fontSize="small" />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <ListItemIcon>
                            <FlowIcon />
                          </ListItemIcon>
                          <Typography variant="body2">
                            {flowProduction?.name}
                          </Typography>
                        </StyledSubAccordionSummary>
                      </StyledNavLink>
                      <ListItemSecondaryAction>
                        <ActionsMenu isProductionFlow flow={flowProduction} />
                      </ListItemSecondaryAction>
                    </Box>
                    <StyledAccordionDetails>
                      <StepList nodes={flow.nodes} isProductionFlow />
                    </StyledAccordionDetails>
                  </StyledAccordion>
                )}
                <Label variant="body2">Draft Flows</Label>
                {flowList.map((flowItem) => (
                  <StyledAccordion
                    key={flowItem.id}
                    expanded={
                      expandedFlow === flowItem.id && expandedFlow === id
                    }
                    slotProps={{ transition: { unmountOnExit: true } }}
                    onChange={handleChangeFlow(flowItem.id)}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <StyledNavLink
                        to={`${routes.underwriting.flow.list(flowItem.id)}`}
                      >
                        <StyledSubAccordionSummary
                          expandIcon={
                            <ExpandMoreIcon
                              sx={{
                                color: flowItem.id === id ? palette.primary : ''
                              }}
                              onClick={(e: React.MouseEvent<SVGSVGElement>) => {
                                handleExpandIconClick(e, flowItem.id);
                              }}
                              fontSize="medium"
                            />
                          }
                          aria-controls={`${flowItem.name}-content`}
                          id={flowItem.name}
                        >
                          <ListItemIcon>
                            <FlowIcon />
                          </ListItemIcon>
                          <Typography variant="body2">
                            {flowItem.name}
                          </Typography>
                        </StyledSubAccordionSummary>
                      </StyledNavLink>
                      <ListItemSecondaryAction>
                        <ActionsMenu flow={flowItem} />
                      </ListItemSecondaryAction>
                    </Box>
                    <StyledAccordionDetails>
                      <StepList nodes={flow.nodes} />
                    </StyledAccordionDetails>
                  </StyledAccordion>
                ))}
                <AddFlow />
              </StyledAccordionDetails>
            </StyledAccordion>
          ) : (
            <StyledListItemButton component={NavLink} to={defaultFlowListLink}>
              <ListItemIcon>
                <FlowListIcon />
              </ListItemIcon>
            </StyledListItemButton>
          )}
          {pages.map((item, index) =>
            hasPermission(user?.policies, item) ? (
              <StyledListItemButton
                key={index}
                component={NavLink}
                to={item.to}
                expanded={expanded ? 1 : 0}
                className={match && index === 0 ? 'active' : ''}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {expanded && (
                  <ListItemText
                    primary={item.text}
                    sx={animationStyles(expanded)}
                  />
                )}
              </StyledListItemButton>
            ) : null
          )}
          {hasVisibleReports &&
            (expanded ? (
              <StyledAccordion
                disableGutters
                expanded={expandedReports}
                onChange={handleReportsToggle}
                slotProps={{ transition: { unmountOnExit: true } }}
              >
                <StyledMainAccordionSummary
                  expandIcon={<ExpandMoreIcon color="primary" />}
                  aria-controls="reports-content"
                  id="reports-header"
                  expanded={expanded ? 1 : 0}
                >
                  <ListItemIcon>
                    <ReportsIcon />
                  </ListItemIcon>
                  <Typography sx={animationStyles(expanded)}>
                    Reports
                  </Typography>
                </StyledMainAccordionSummary>
                <StyledAccordionDetails>
                  {reportPages.map((item, index) =>
                    hasPermission(user?.policies, item) ? (
                      <StyledListItemButton
                        key={index}
                        component={NavLink}
                        to={item.to}
                        sx={{
                          '&:hover svg, &.active svg': {
                            transform: 'scale(1.5)',
                            color: theme.palette.primary.main
                          }
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            paddingLeft: 2
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">{item.text}</Typography>
                          }
                          sx={animationStyles(expanded)}
                        />
                      </StyledListItemButton>
                    ) : null
                  )}
                </StyledAccordionDetails>
              </StyledAccordion>
            ) : (
              <>
                <StyledListItemButton onClick={handleOpenMenu}>
                  <ListItemIcon>
                    <ReportsIcon />
                  </ListItemIcon>
                </StyledListItemButton>
                <Menu
                  anchorEl={reportMenuAnchorEl}
                  open={Boolean(reportMenuAnchorEl)}
                  onClose={handleCloseMenu}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    sx={{
                      background: theme.palette.background.default,
                      padding: '2px 16px'
                    }}
                  >
                    <Typography
                      color={theme.palette.text.secondary}
                      variant="body2"
                    >
                      Reports
                    </Typography>
                  </MenuItem>
                  {reportPages.map((item, index) =>
                    hasPermission(user?.policies, item.permission) ? (
                      <MenuItem
                        key={index}
                        component={NavLink}
                        to={item.to}
                        onClick={handleCloseMenu}
                        sx={{
                          '&.active': {
                            background: palette.amber,
                            color: theme.palette.primary.main
                          }
                        }}
                      >
                        <ListItemText primary={item.text} />
                      </MenuItem>
                    ) : null
                  )}
                </Menu>
              </>
            ))}
        </StyledList>
      </StyledWrapper>
    </StyledPaper>
  );
};

export default Sidebar;
