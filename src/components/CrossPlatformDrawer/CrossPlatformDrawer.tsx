import { useState, useEffect } from 'react';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import { ApplicationModel } from '@eloanwarehouse/frontend-core';

import { StyledDrawer, StyledList, StyledListItemButton } from './styled';
import { applications } from './config';

import { LAUNCHER_URL } from '@constants/common';
import HomeIcon from '@icons/home.svg';
import { authService } from '@services/auth';

const CrossPlatformDrawer: React.FC = () => {
  const [allowedApplications, setAllowedApplications] = useState<
    ApplicationModel[] | []
  >([]);

  const fetchAllowedApplications = async () => {
    try {
      const response = await authService.fetchAllowedApplications();
      setAllowedApplications(response.data as ApplicationModel[]);
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    void fetchAllowedApplications();
  }, []);

  const handleRedirect = (platformURL: string) =>
    window.open(platformURL, '_self');

  return (
    <StyledDrawer variant="permanent" open={true}>
      <StyledList>
        <ListItem disablePadding>
          <Tooltip title="Launcher" followCursor placement="right-start">
            <StyledListItemButton
              onClick={() => handleRedirect(LAUNCHER_URL)}
              className="launcher"
            >
              <HomeIcon />
            </StyledListItemButton>
          </Tooltip>
        </ListItem>
        {allowedApplications?.map(({ name, url }) => {
          const application = applications.find((item) => item.key === name);
          if (!application) return null;
          return (
            <ListItem key={name} disablePadding>
              <Tooltip
                title={application.name}
                placement="right-start"
                followCursor
              >
                <StyledListItemButton
                  onClick={() => handleRedirect(url)}
                  isSelected={url === window.location.origin + '/'}
                  className={application?.className}
                >
                  <img src={application.iconSrc} />
                </StyledListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </StyledList>
    </StyledDrawer>
  );
};

export default CrossPlatformDrawer;