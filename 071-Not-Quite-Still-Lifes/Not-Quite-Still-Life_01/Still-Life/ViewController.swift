//
//  ViewController.swift
//  Still-Life
//
//  Created by Patrick Burke on 2018-03-18.
//  Copyright © 2018 Patrick Burke. All rights reserved.
//

import UIKit
import SceneKit
import ARKit
import VideoToolbox
import AVFoundation

// Class is "ViewController"
// Inherits from "UIViewController", etc.
class ViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate
{

    // "@IBOutlet" allows the use of outlets and actions in Swift to connect the source code to interface objects
    // "sceneView" is an instance of the "ARSCNView" class
    // "!" is an implicitly unwrapped optional
    @IBOutlet var sceneView: ARSCNView!
    
    // Function inherited from UIKit
    // "Override" inherited characteristics to perform additional initializations
    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        // Set the view's delegate
        // Enables a class or struc to hand off some of its responsibilities to an instance of another type
        sceneView.delegate = self
        
        // Set the session's delegate
        sceneView.session.delegate = self
        
        // Show statistics such as fps and timing information
        sceneView.showsStatistics = false
        
        // Create a new scene
        // 3D SceneKit view
        let scene = SCNScene()
        
        // Set the scene to the view
        sceneView.scene = scene
        
        let pressGesture = UILongPressGestureRecognizer(target: self, action:
            #selector(ViewController.handlePress(gestureRecognize:)))
        view.addGestureRecognizer(pressGesture)
        
    }
    
    
    // Makes func available to Objective-C
    // "handlePress" is the function
    // "gestureRecognize" is the parameter name
    // "UILongPressGestureRecognizer" is the parameter type
    // Function doesn't return anything
    @objc
    func handlePress(gestureRecognize: UILongPressGestureRecognizer){
        guard let currentARFrame = sceneView.session.currentFrame else {
            return
        }
        
        if gestureRecognize.state == .began {
            print("long press start")
            
        } else if gestureRecognize.state == .ended {
            print("long press end")
            
            // create spritekit scene
            // set it to whatever size we want
            // we're going to add the video node to this, because video nodes dont exist in SceneKit scenes
            let spriteKitScene = SKScene(
                size: CGSize(
                    width: 640,
                    height: 360
                )
            )
            
            // get the video from our assets
            let videoPath = Bundle.main.path(forResource: "timesquare_720", ofType: "mp4")
            let videoURL = NSURL(fileURLWithPath: videoPath!)
            let videoPlayer = AVPlayer(url: videoURL as URL)
            

            // this uses an observer
            // NEED TO UNDERSTAND WHAT THE HELL IS GOING ON HERE
            // add an observer for the "AVPlanterItemDidPlayToEndTime" notification that comes from the video player we set up
            // when the notification is observered, use the playerItemDidReachEnd callback function that we wrote
            videoPlayer.actionAtItemEnd = .none
            NotificationCenter.default.addObserver(
                self,
                selector: #selector(ViewController.playerItemDidReachEnd),  //specifies the message the receiver sends observer to notify it of the notification posting
                name: NSNotification.Name.AVPlayerItemDidPlayToEndTime, //name of the notification for which to register the observe
                object: videoPlayer.currentItem // object whose notifications the observer wants to receive
            )
            
            
            // Create the SpriteKit video node, containing the video player
            let videoSpriteKitNode = SKVideoNode(avPlayer: videoPlayer)
            // set the video node to be positioned in the middle of the scene
            videoSpriteKitNode.position = CGPoint(
                x: spriteKitScene.size.width / 2.0,
                y: spriteKitScene.size.height / 2.0
            )
            // set the video to the same size as the spritekit scene
            videoSpriteKitNode.size = spriteKitScene.size
            videoSpriteKitNode.yScale = -1.0
            // make the video play as soon as it's rendered to the screen
            videoSpriteKitNode.play()
            // add the video node to the sprite kit scene
            spriteKitScene.addChild(videoSpriteKitNode)
            
            
            // Create a SceneKit plane and add the SpriteKit scene as its material
            // create a video plane for us to place the sprikeKit scene onto
            let videoPlane = SCNPlane(width: 0.75, height: 0.75)
            // set the material contents of the plane to the sprite kit scene
            videoPlane.firstMaterial?.diffuse.contents = spriteKitScene
            videoPlane.firstMaterial?.lightingModel = .constant
            
            // Create a node for the plane and add it to the scene
            // assign the videoPlane as the geometry for the node
            let videoPlaneNode = SCNNode(geometry: videoPlane)
            // add the videoPlaneNode to our scene
            sceneView.scene.rootNode.addChildNode(videoPlaneNode)
            
            
            // Set transform of node to be 40cm "in front" of camera
            var translation = matrix_identity_float4x4
            translation.columns.3.z = 0.1
            videoPlaneNode.simdTransform = matrix_multiply(currentARFrame.camera.transform, translation)
            videoPlaneNode.eulerAngles = SCNVector3(Double.pi,0,0)
        }
    }

    
    // This callback will restart the video when it has reach its end
    @objc
    func playerItemDidReachEnd(notification: NSNotification) {
        if let playerItem: AVPlayerItem = notification.object as? AVPlayerItem {
            playerItem.seek(to: kCMTimeZero, completionHandler: nil)
        }
    }
    
    func session(_ session: ARSession, didUpdate frame: ARFrame) {
        print("updated")
    }

    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillAppear(_ animated: Bool)
    {
        super.viewWillAppear(animated)
        
        // Create a session configuration
        let configuration = ARWorldTrackingConfiguration()

        // Run the view's session
        sceneView.session.run(configuration)
    }
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillDisappear(_ animated: Bool)
    {
        super.viewWillDisappear(animated)
        
        // Pause the view's session
        sceneView.session.pause()
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Release any cached data, images, etc that aren't in use.
    }


    // MARK: - ARSCNViewDelegate
    
/*
    // Override to create and configure nodes for anchors added to the view's session.
    func renderer(_ renderer: SCNSceneRenderer, nodeFor anchor: ARAnchor) -> SCNNode? {
        let node = SCNNode()
     
        return node
    }
*/
    
    func session(_ session: ARSession, didFailWithError error: Error)
    {
        // Present an error message to the user
        
    }
    
    func sessionWasInterrupted(_ session: ARSession)
    {
        // Inform the user that the session has been interrupted, for example, by presenting an overlay
        
    }
    
    func sessionInterruptionEnded(_ session: ARSession)
    {
        // Reset tracking and/or remove existing anchors if consistent tracking is required
        
    }
}
