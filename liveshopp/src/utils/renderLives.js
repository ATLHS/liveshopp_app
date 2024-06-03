import React, { useEffect } from 'react';

import LiveCard from '../../src/components/liveCard/liveCard';

const renderLives = (lives, user, stack, onPressAction = () => {}) => {
  return lives.map((live, id) => {
    const imageUrl = stack === 'userStack' ? live.imageUrl : user.imageUrl;
    return (
      <LiveCard
        key={id}
        sellerName={live.sellerName}
        title={live.live_name}
        datetime={live.live_date_time}
        description={live.live_description}
        category={live.business_activity}
        status={live.live_status}
        onPress={() => onPressAction(live)}
        imageUrl={imageUrl}
        imageKey={user.imageUrl}
      />
    );
  });
};

export default renderLives;
