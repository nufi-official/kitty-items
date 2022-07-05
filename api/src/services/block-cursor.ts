/**
 * Block Cursor Service
 * 
 * Service class used to query the block_cursor table to READ/INSERT/UPDATE block cursors for relative events.
 *
 */
import { BlockCursor } from "../models/block-cursor";
import { v4 } from 'uuid';
class BlockCursorService {

  async findOrCreateLatestBlockCursor(
    eventName: string,
    latestBlockHeight?: number,
  ) {
    console.log(eventName);
    let blockCursor = await BlockCursor.query().findOne({
      event_name: eventName,
    });

    if (!blockCursor) {
      blockCursor = await BlockCursor.query().insertAndFetch({
        id: v4(),
        event_name: eventName,
        current_block_height: latestBlockHeight,
      });
    }
    
    console.log("sqlblock: " + JSON.stringify(blockCursor));
    return blockCursor;
  }

  async updateBlockCursorById(id: string, currentBlockHeight: number) {
    return BlockCursor.query().updateAndFetchById(id, {
      current_block_height: currentBlockHeight,
    });
  }
}

export { BlockCursorService };
