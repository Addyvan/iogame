module.exports = {

  0: [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]], // TODO figure out a solution to account for off rail movement

  1069: [0, [0, 1, 0], 0, [0, 1, 0]], // straight horinzontal
  1126: [[0, 1, 0], 0, [0, 1, 0], 0], // straight vertical

  1068: [[1, 0, 0], [0, 0, 1], 0, 0], // corner S-W
  1067: [[0, 0, 1], 0, 0, [1, 0, 0]], // corner S-e
  1125: [0, [1, 0, 0], [0, 0, 1], 0], // corner N-W
  1124: [0, 0, [1, 0, 0], [0, 0, 1]], // corner N-e

  1072: [[1, 0, 0], [0, 1, 1], 0, [0, 1, 0]], // horizontal with corner S-W
  1071: [[0, 0, 1], [0, 1, 0], 0, [1, 1, 0]], // horizontal with corner S-e
  1129: [0, [1, 1, 0], [0, 0, 1], [0, 1, 0]], // horizontal with corner N-W
  1128: [0, [0, 1, 0], [1, 0, 0], [0, 1, 1]], // horizontal with corner N-e

  1074: [[1, 0, 0], [0, 1, 1], 0, [0, 1, 0]], // horizontal with corner S-W
  1073: [[0, 0, 1], [0, 1, 0], 0, [1, 1, 0]], // horizontal with corner S-e
  1131: [0, [1, 1, 0], [0, 0, 1], [0, 1, 0]], // horizontal with corner N-W
  1130: [0, [0, 1, 0], [1, 0, 0], [0, 1, 1]], // horizontal with corner N-e

  1186: [[1, 1, 0], [0, 0, 1], [0, 1, 0], 0], // vertical with corner S-W
  1185: [[0, 1, 1], 0, [0, 1, 0], [1, 0, 0]], // vertical with corner S-e
  1243: [[0, 1, 0], [1, 0, 0], [0, 1, 1], 0], // vertical with corner N-W
  1242: [[0, 1, 0], 0, [1, 1, 0], [0, 0, 1]], // vertical with corner N-e

  1188: [[1, 1, 0], [0, 0, 1], [0, 1, 0], 0], // vertical with corner S-W
  1187: [[0, 1, 1], 0, [0, 1, 0], [1, 0, 0]], // vertical with corner S-e
  1245: [[0, 1, 0], [1, 0, 0], [0, 1, 1], 0], // vertical with corner N-W
  1244: [[0, 1, 0], 0, [1, 1, 0], [0, 0, 1]], // vertical with corner N-e

  1299: [[0, 1, 0], [0, 1, 0], [0, 1, 0], [0, 1, 0]] // crossroads
}
